// Variables
let model;
let label = "Waiting...";
let port;
let writer;

// DOM Elements
const labelElement = document.getElementById('label');
const connectButton = document.getElementById('connect-button');

// Load the Teachable Machine model
async function loadModel() {
  const modelURL = 'https://teachablemachine.withgoogle.com/models/_aZ3fbVua/model.json';
  model = await ml5.soundClassifier(modelURL);
  console.log("Model loaded!");
  classifyAudio();
}

// Classify the video stream with a 0.5-second delay
function classifyAudio() {
  model.classify(gotResult);
  // if (model) {
  //   // Use setTimeout to delay the detection by 0.5 seconds (500 milliseconds)
  //   setTimeout(() => {
  //     model.classify(gotResult);
  //   }, 500); // 500 milliseconds = 0.5 seconds
  // }
}

// Handle the results
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  // Log the raw results for debugging
  console.log(results);

  // Get the label and confidence score of the top prediction
  let detectedLabel = results[0].label;
  let confidence = results[0].confidence;

  // Only update the label if confidence is greater than 0.7 (70%)
  if (confidence > 0.8) {
    // Customize the message based on the detected object
    if (detectedLabel === "Backgound Noise") {
      label = "Background audio is Detected!";
      sendToESP32(0); // Send 0 to ESP32
    } else if (detectedLabel === "SPICY") {
      label = "特辣的海藻";
      sendToESP32(1); // Send 2 to ESP32
    } else if (detectedLabel === "OMG") {
      label = "OMG";
      sendToESP32(2); // Send 2 to ESP32
    } else if (detectedLabel === "PLANKTON"){
      label = "PLANKTON MOANING";
      sendToESP32(3); // Send 2 to ESP32      
    } else {
      label = "Sound Detected: " + detectedLabel; // Fallback for other objects
    }
  } else {
    label = "Waiting..."; // Reset to "Waiting..." if confidence is low
  }

  // Update the label text
  labelElement.innerText = label;

  // Continue classifying
  classifyAudio();
}

// Send data to ESP32 via Web Serial API
async function sendToESP32(data) {
  if (writer) {
    try {
      // Convert the data to a Uint8Array and send it
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(data.toString()));
      console.log("Sent to ESP32:", data);
    } catch (error) {
      console.error("Error sending data to ESP32:", error);
    }
  } else {
    console.warn("Serial port not connected.");
  }
}

// Request access to the serial port
async function connectSerialPort() {
  try {
    // Prompt the user to select the port
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 }); // Set baud rate to match ESP32
    writer = port.writable.getWriter();
    console.log("Serial port connected!");
  } catch (error) {
    console.error("Error connecting to serial port:", error);
  }
}

// Add event listener to the connect button
connectButton.addEventListener('click', () => {
  connectSerialPort();
});

// Start the project
loadModel();