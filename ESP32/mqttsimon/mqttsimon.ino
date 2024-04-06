//https://randomnerdtutorials.com/esp32-esp8266-rgb-led-strip-web-server/
//https://chat.openai.com/c/c045a38a-3855-4d72-b7ed-6704f9042ad9

// Load Wi-Fi library
#include <WiFi.h>
#include <PubSubClient.h>


// Replace with your network credentials
const char* ssid     = "Juicy Calves Content House";
const char* password = "GoBears2023";
const char* mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;
const char* mqttTopic = "esp32/commands";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long previousMillis = 0;        // will store last time LED was updated
const long interval = 500;              // interval at which to keep the LED on (milliseconds)
unsigned long currentMillis = millis();

void setup_wifi() {
  // Connect to Wi-Fi network with SSID and password
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
    // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Handle message arrived
  payload[length] = '\0'; // Null-terminate the payload
  String message = String((char*)payload);
  // Example: Turn an LED on if the message is "on"
  Serial.println("GOt a message!");
  Serial.println(message);
  if(message == "blue111") {
    digitalWrite(2, HIGH); //  flip LED on
    previousMillis = currentMillis;
    // Turn LED on
  } else if(message == "off222") {
    digitalWrite(2, LOW);  // flip LED on
    // Turn LED off
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP32ClientIced")) { // "ESP32Client" is the client ID for the MQTT connection
      Serial.println("connected");
      // Once connected, publish an announcement and subscribe
      client.subscribe(mqttTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {

  Serial.begin(115200);

  // Initialize the onboard LED pin as an output.
  pinMode(2, OUTPUT);
  setup_wifi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    // Check if the interval has passed
    digitalWrite(2, LOW);                // Turn LED off
  }

  // if (client.connect("ESP32ClientIced")) {
  //   client.subscribe(mqttTopic);
  // }
}
