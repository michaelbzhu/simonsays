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

//pinouts
const int blue = 2;
const int red = 22;
const int green = 21;
const int yellow = 19;

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


void callback(char* topic, byte* payload, unsigned int length) {
  // Handle message arrived
  payload[length] = '\0'; // Null-terminate the payload
  String message = String((char*)payload);
  // Example: Turn an LED on if the message is "on"
  Serial.println("Got a message!");
  Serial.println(message);
  if (message.startsWith("SEQ")) {
    // Iterate through each character after "SEQ"
    for (int i = 3; i < message.length(); i++) {
      // Perform actions based on the character
      switch (message.charAt(i)) {
        case '0':
          digitalWrite(red, HIGH);
          delay(500);
          digitalWrite(red, LOW);
          break;
        case '1':
          digitalWrite(blue, HIGH);
          delay(500);
          digitalWrite(blue, LOW);
          break;
        case '2':
          digitalWrite(green, HIGH);
          delay(500);
          digitalWrite(green, LOW);
          break;
        case '3':
          digitalWrite(yellow, HIGH);
          delay(500);
          digitalWrite(yellow, LOW);
          break;
        // Add more cases if you have more characters/actions
      }
      delay(250);
    }
  } else {
    if(message == "INPR") {
      digitalWrite(red, HIGH); //  flip LED on    // Turn LED on
    } else if(message == "INPB") {
      digitalWrite(blue, HIGH);  // flip LED on
    } else if(message == "INPG") {
      digitalWrite(green, HIGH);  // flip LED on
    } else if(message == "INPY") {
      digitalWrite(yellow, HIGH);  // flip LED on
    }
  }
  previousMillis = currentMillis;

}

void setup() {

  Serial.begin(115200);

  // Initialize the onboard LED pin as an output.
  pinMode(blue, OUTPUT);//blue
  pinMode(red, OUTPUT);//red
  pinMode(green, OUTPUT);//green
  pinMode(yellow, OUTPUT);//yellow

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
    digitalWrite(blue, LOW);
    digitalWrite(red, LOW);
    digitalWrite(green, LOW);
    digitalWrite(yellow, LOW);

  }

  // if (client.connect("ESP32ClientIced")) {
  //   client.subscribe(mqttTopic);
  // }
}
