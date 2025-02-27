#include <Arduino.h>

#define ledPin1 27
#define ledPin2 26
#define ledPin3 25

void setup() {
  pinMode(ledPin1, OUTPUT);  // sets the pin as output
  pinMode(ledPin2, OUTPUT);
  // Initialize serial communication at 115200 baud rate
  Serial.begin(115200);
  while (!Serial) {
    ; // Wait for serial port to connect
  }
  Serial.println("ESP32 Ready!");
}

void loop() {
  // Check if data is available on the serial port
  if (Serial.available() > 0) {
    // Read the incoming byte
    int data = Serial.read() - '0'; // Convert ASCII to integer
    Serial.print("Received: ");
    Serial.println(data);

    // Perform actions based on the received data
    switch (data) {
      case 0:
        Serial.println("Action: Calculator Detected");
        digitalWrite(ledPin1,1);
        digitalWrite(ledPin2,0);
        break;
      case 1:
        Serial.println("Action: Scissors Detected");
        digitalWrite(ledPin1,0);
        digitalWrite(ledPin2,1);
        break;
      case 2:
        Serial.println("Action: Background Detected");
        digitalWrite(ledPin1,0);
        digitalWrite(ledPin2,0);
        break;
      default:
        Serial.println("Action: Unknown Object");
        digitalWrite(ledPin1,0);
        digitalWrite(ledPin2,0);
        break;
    }
  }
}
