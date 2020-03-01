const admin = require('firebase-admin');
var serviceAccount = require("./daybook-30870-firebase-adminsdk-8vdem-e9c6106a64.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://daybook-30870.firebaseio.com"
});
module.exports = admin;