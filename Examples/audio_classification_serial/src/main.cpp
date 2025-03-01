#include <Arduino.h>
#include "SPI.h"
#include "TFT_eSPI.h"
#include "U8g2_for_TFT_eSPI.h"
#include "Free_Fonts.h" 

#define FONT u8g2_font_wqy16_t_gb2312b  // Chinese font

U8g2_for_TFT_eSPI u8f;  // U8g2 font instance
TFT_eSPI tft = TFT_eSPI();

#define TEXT "特辣的海藻"  // Text to be displayed

void setup(void) {
    tft.begin();
    tft.setRotation(1);
    tft.fillScreen(TFT_BLACK);
    
    u8f.begin(tft);  // Initialize U8g2 with TFT_eSPI
    u8f.setFont(FONT);
    u8f.setForegroundColor(TFT_WHITE);  // Set text color
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
            tft.setTextDatum(MC_DATUM);
            tft.setTextColor(TFT_WHITE, TFT_BLACK);
            tft.fillScreen(TFT_BLACK);
            tft.setFreeFont(FF7);
            tft.drawString("Background Noise", 160, 120, GFXFF);
            delay(1000);
            break;
        case 1:
            tft.fillScreen(TFT_BLACK);  // Clear screen
            u8f.setCursor(120, 120);     // Set cursor position (adjust as needed)
            u8f.print("特辣的海藻");            // Display Chinese text
            delay(1000);
            break;
        case 2:
            tft.setTextDatum(MC_DATUM);
            tft.setTextColor(TFT_WHITE, TFT_BLACK);
            tft.fillScreen(TFT_BLACK);
            tft.setFreeFont(FF8);
            tft.drawString("OMG", 160, 120, GFXFF);
            delay(1000);
            break;
        case 3:
            tft.setTextDatum(MC_DATUM);
            tft.setTextColor(TFT_WHITE, TFT_BLACK);
            tft.fillScreen(TFT_BLACK);
            tft.setFreeFont(FF7);
            tft.drawString("PLANKTON MOANING", 160, 120, GFXFF);
            delay(1000);        
            break;
        default:
            break;
        }
    }
}
