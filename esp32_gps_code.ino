#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// === WiFi Configuration ===
const char* ssid = "Jain 713";
const char* password = "Jain@54321";

// === Flask Server Configuration ===
const char* serverURL = "http://10.0.2.191:5000/update_location";

// === GPS Configuration ===
#define GPS_RX_PIN 16  // GPS TX → ESP32 RX
#define GPS_TX_PIN 17  // GPS RX ← ESP32 TX

TinyGPSPlus gps;
HardwareSerial gpsSerial(2); // UART2 for GPS

// === Timing Variables ===
unsigned long lastUpdateTime = 0;
const unsigned long UPDATE_INTERVAL = 10000; // 10 seconds

// === GPS Status Variables ===
bool gpsValid = false;
int satellites = 0;
float hdop = 0;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(115200, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  delay(5000);

  Serial.println("\n\n**********************************************************************************");
  Serial.println("  Bharat Pi NavIC Shield Test Program");
  Serial.println("  UART2: GPIO16 (RX), GPIO17 (TX)");
  Serial.println("  Please wait while the NavIC module latches to satellites.");
  Serial.println("  Red LED (PPS) will blink once locked.");
  Serial.println("  Ensure clear sky visibility.");
  Serial.println("**********************************************************************************\n");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");
  Serial.print("📡 IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("🌐 Flask Server: ");
  Serial.println(serverURL);
}

void loop() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // Update every 10 seconds
  if (gps.location.isUpdated() && millis() - lastUpdateTime >= UPDATE_INTERVAL) {
    float latitude = gps.location.lat();
    float longitude = gps.location.lng();
    satellites = gps.satellites.value();
    hdop = gps.hdop.hdop();

    if (gps.location.isValid() && satellites >= 4 && hdop < 5.0) {
      gpsValid = true;

      Serial.println("\n=== GPS Data ===");
      Serial.print("Lat: "); Serial.println(latitude, 7);
      Serial.print("Long: "); Serial.println(longitude, 7);
      Serial.print("Google Maps: "); 
      Serial.println("http://maps.google.com/maps?q=" + String(latitude, 7) + "," + String(longitude, 7));
      Serial.print("Speed (knots): "); Serial.println(gps.speed.knots(), 2);
      Serial.print("Course (°): "); Serial.println(gps.course.deg(), 2);
      Serial.print("Altitude (m): "); Serial.println(gps.altitude.meters(), 2);
      Serial.print("Satellites: "); Serial.println(satellites);
      Serial.print("HDOP: "); Serial.println(hdop, 2);
      Serial.println("-----------------------------");

      if (WiFi.status() == WL_CONNECTED) {
        sendLocationToServer(latitude, longitude);
      } else {
        Serial.println("❌ WiFi disconnected! Trying to reconnect...");
        WiFi.reconnect();
      }

      lastUpdateTime = millis();
    } else {
      gpsValid = false;
      Serial.println("⚠️ Weak GPS signal. Waiting...");
      Serial.print("Satellites: "); Serial.print(satellites);
      Serial.print(" | HDOP: "); Serial.println(hdop, 2);
    }
  }

  // Periodic Status
  static unsigned long lastStatusTime = 0;
  if (millis() - lastStatusTime >= 30000) {
    printGPSStatus();
    lastStatusTime = millis();
  }

  delay(100); // Prevent watchdog reset
}

void sendLocationToServer(float lat, float lng) {
  HTTPClient http;

  // Build JSON
  String payload = "{\"latitude\":" + String(lat, 6) + ",\"longitude\":" + String(lng, 6) + "}";
  Serial.println("📤 Sending to server: " + payload);

  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  int responseCode = http.POST(payload);

  if (responseCode > 0) {
    String response = http.getString();
    Serial.println("✅ POST Success! Code: " + String(responseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("❌ POST Failed: " + http.errorToString(responseCode));
  }

  http.end();
}

void printGPSStatus() {
  Serial.println("\n=== GPS Status ===");
  Serial.print("Valid: "); Serial.println(gpsValid ? "Yes" : "No");
  Serial.print("Satellites: "); Serial.println(satellites);
  Serial.print("HDOP: "); Serial.println(hdop, 2);
  Serial.print("WiFi: "); Serial.println(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  Serial.println("===================\n");
}
