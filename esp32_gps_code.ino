#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "Jain 713";
const char* password = "Jain@54321";

// Flask Server Configuration
const char* serverURL = "http://10.0.2.191:5000/update_location";

// GPS Configuration
TinyGPSPlus gps;
HardwareSerial GPS_Serial(1);  // UART1 (GPIOs: RX=16, TX=17)

// Timing variables
unsigned long lastUpdateTime = 0;
const unsigned long UPDATE_INTERVAL = 10000; // 10 seconds

// GPS status variables
bool gpsValid = false;
int satellites = 0;
float hdop = 0;

void setup() {
  Serial.begin(115200);
  GPS_Serial.begin(9600, SERIAL_8N1, 16, 17);  // adjust pins based on your wiring

  Serial.println("ESP32 GPS Parking Zone Finder");
  Serial.println("=============================");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected successfully!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Server URL: ");
  Serial.println(serverURL);
}

void loop() {
  // Read GPS data
  while (GPS_Serial.available() > 0) {
    gps.encode(GPS_Serial.read());
  }

  // Check if GPS data is valid and enough time has passed
  if (gps.location.isValid() && millis() - lastUpdateTime >= UPDATE_INTERVAL) {
    float latitude = gps.location.lat();
    float longitude = gps.location.lng();
    satellites = gps.satellites.value();
    hdop = gps.hdop.value();

    // Only send if we have good GPS signal
    if (satellites >= 4 && hdop < 5.0) {
      gpsValid = true;
      
      Serial.println("=== GPS Data ===");
      Serial.print("Latitude: ");
      Serial.println(latitude, 6);
      Serial.print("Longitude: ");
      Serial.println(longitude, 6);
      Serial.print("Satellites: ");
      Serial.println(satellites);
      Serial.print("HDOP: ");
      Serial.println(hdop, 1);
      Serial.println("================");

      // Send to Flask Server
      if (WiFi.status() == WL_CONNECTED) {
        sendLocationToServer(latitude, longitude);
      } else {
        Serial.println("WiFi disconnected! Reconnecting...");
        WiFi.reconnect();
      }
      
      lastUpdateTime = millis();
    } else {
      gpsValid = false;
      Serial.println("GPS signal too weak. Waiting for better signal...");
      Serial.print("Satellites: ");
      Serial.print(satellites);
      Serial.print(" | HDOP: ");
      Serial.println(hdop, 1);
    }
  }

  // Print GPS status every 30 seconds
  static unsigned long lastStatusTime = 0;
  if (millis() - lastStatusTime >= 30000) {
    printGPSStatus();
    lastStatusTime = millis();
  }

  delay(100); // Small delay to prevent watchdog issues
}

void sendLocationToServer(float lat, float lng) {
  HTTPClient http;
  
  // Create JSON payload
  String jsonPayload = "{\"latitude\":" + String(lat, 6) + ",\"longitude\":" + String(lng, 6) + "}";
  
  Serial.println("Sending to server: " + jsonPayload);
  
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("✅ POST Success! Code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("❌ POST Failed: " + http.errorToString(httpResponseCode));
  }
  
  http.end();
}

void printGPSStatus() {
  Serial.println("\n=== GPS Status ===");
  Serial.print("Valid: ");
  Serial.println(gpsValid ? "Yes" : "No");
  Serial.print("Satellites: ");
  Serial.println(satellites);
  Serial.print("HDOP: ");
  Serial.println(hdop, 1);
  Serial.print("WiFi: ");
  Serial.println(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  Serial.println("================\n");
} 