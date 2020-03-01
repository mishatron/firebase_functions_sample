// const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('./firebaseAdmin');
const db = admin.firestore();
const debugRef = db.collection('debug');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const express = require('express')
const v1 = require('./v1')

const app = express();
app.use('/v1', v1);
module.exports = {
    api: functions.https.onRequest(app)
}