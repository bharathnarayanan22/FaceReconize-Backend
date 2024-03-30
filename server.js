// const express = require('express');
// const faceapi = require('face-api.js');
// const { Canvas, Image, ImageData } = require('canvas');
// const path = require('path');
// const cors = require('cors');
// const app = express();
// const PORT =  5173;
// app.use(cors());

// // Set up face-api.js
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
// const MODEL_URL = path.join(__dirname, 'models');
// faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
// faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
// faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

// // Define route for face recognition
// app.get(`http://localhost:${PORT}/recognize`, async (req, res) => {
//   try {
//     // Load the image
//     const imagePath = path.join(__dirname, 'image', 'bharath.jpg');
//     const image = await faceapi.bufferToImage(await fs.promises.readFile(imagePath));

//     // Detect faces in the image
//     const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

//     // Check if any faces were detected
//     if (detections.length > 0) {
//       // For simplicity, assume only one face is detected
//       const faceDescriptor = detections[0].descriptor;

//       // Compare the face descriptor with known faces (you need to have known face descriptors for comparison)
//       // For demonstration purposes, let's assume you have a known face descriptor stored somewhere
//       const knownFaceDescriptor = hi;

//       // Compare the detected face descriptor with the known face descriptor
//       const isMatch = faceapi.euclideanDistance(faceDescriptor, knownFaceDescriptor) < 0.6;

//       // If the detected face matches the known face, identify the person
//       if (isMatch) {
//         res.json({ success: true, message: 'Face recognized: Bharath' });
//       } else {
//         res.json({ success: true, message: 'Unknown person' });
//       }
//     } else {
//       res.json({ success: true, message: 'No face detected' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const mongoose = require("mongoose");
const express = require("express");
const { faceUsers } = require("./schema.js");
const bodyParser = require("body-parser");
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const path = require('path');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors())

async function connectToDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://Bharath:bharath22@cluster0.0ezxyyp.mongodb.net/faceRecognizeUsers"
    );
    console.log("DB connection established");
    const port = process.env.PORT || 7000
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Couldn't establish connection");
  }
}

connectToDb();

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const MODEL_URL = path.join(__dirname, 'models');
faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

app.post("/add-faceUsers", async function (request, response) {
  try {
    await faceUsers.create({
      name: request.body.name,
      image: request.body.image,
    });
    response.status(201).json({
      "status": "success",
      "message": "entry created",
    });
  } catch (error) {
    response.status(500).json({
     "status": "failure",
      "message": "entry not created",
      "error": error,
    });
  }
});

app.get("/get-faceUsers", async function (request, response) {
  try {
    const faceUsersDetails = await faceUsers.find();
    response.status(200).json(faceUsersDetails);
  } catch (error) {
    response.status(500).json({
      "status": "failure",
      "message": "entry not fetch data",
      "error": error,
    });
  }
});