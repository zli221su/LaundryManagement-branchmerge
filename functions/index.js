//const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

//Listens change from firebase database
exports.sendNotification = functions.database.ref('/washing_machine/{washing_machine_id}')
     .onUpdate((change, context) => {

        var machineSnapshot = change.after.val();
        const washing_machine_id =  context.params.washing_machine_id
        const status_id = machineSnapshot.status_id

         if (status_id !== "3" && status_id !== "4") {
              return null;
         }
         // Grab the current value of what was written to the Realtime Database.


         var topic = "android";

         var payload = {
             data: {
                 status_id : status_id,
                 status_type : machineSnapshot.drawable_label,
                 user_email : machineSnapshot.user_email
//                 description : machineSnapshot.event_description
             }
         };

     // Send firebase cloud message to devices subscribed to the provided topic.
     return admin.messaging().sendToTopic(topic, payload)
         .then(function (response) {
             // See the MessagingTopicResponse reference documentation for the
             // contents of response.
             console.log("Successfully sent message:", response);
             return -1;
         })
         .catch(function (error) {
             console.log("Error sending message:", error);
         });
     })
