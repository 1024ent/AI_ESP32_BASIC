// Variables
let video;
let model;
let label = "Waiting...";
let port;
let writer;

// DOM Elements
const videoElement = document.getElementById('video');
const labelElement = document.getElementById('label');
const connectButton = document.getElementById('connect-button');

// Load the Teachable Machine model
async function loadModel() {
  const modelURL = 'https://teachablemachine.withgoogle.com/models/fa1rwLwYy/model.json';
  model = await ml5.imageClassifier(modelURL);
  console.log("Model loaded!");
  classifyVideo();
}

// Classify the video stream with a 0.5-second delay
function classifyVideo() {
  if (model) {
    // Use setTimeout to delay the detection by 0.5 seconds (500 milliseconds)
    setTimeout(() => {
      model.classify(videoElement, gotResult);
    }, 500); // 500 milliseconds = 0.5 seconds
  }
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
  if (confidence > 0.7) {
    // Customize the message based on the detected object
    if (detectedLabel === "CALCULATOR") {
      label = "🧮 Calculator is Detected!";
      sendToESP32(0); // Send 0 to ESP32
    } else if (detectedLabel === "SCISSORS") {
      label = "✂️ Scissors are Detected!";
      sendToESP32(1); // Send 1 to ESP32
    } else if (detectedLabel === "BACKGROUND") {
      label = "No object detected (Background)";
      sendToESP32(2); // Send 2 to ESP32
    } else {
      label = "Object Detected: " + detectedLabel; // Fallback for other objects
    }
  } else {
    label = "Waiting..."; // Reset to "Waiting..." if confidence is low
  }

  // Update the label text
  labelElement.innerText = label;

  // Continue classifying
  classifyVideo();
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

// Initialize the webcam and load the model
async function init() {
  try {
    // Access the webcam
    video = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = video;
    videoElement.onloadedmetadata = () => {
      console.log("Webcam is ready!");
      loadModel();
    };
  } catch (error) {
    console.error("Error accessing the webcam:", error);
  }
}

// Add event listener to the connect button
connectButton.addEventListener('click', () => {
  connectSerialPort();
});

// Start the project
init();
