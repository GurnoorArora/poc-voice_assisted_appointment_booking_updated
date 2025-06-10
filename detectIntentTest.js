// Import the Dialogflow library
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Replace with the path to your service account key file
const CREDENTIALS_PATH = 'C:/OneDrive - H&R BLOCK LTD/Desktop/poc-voice_assisted_appointment_booking/credential.json';

// Replace with your Dialogflow project ID
const PROJECT_ID = 'hrb-assisstant-ijfe';

// Create a new session ID
const sessionId = uuid.v4();

async function runSample() {
  // Create a new session client
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: CREDENTIALS_PATH,
  });

  const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: 'Book an appoitnment for john doe on 2023-10-10 at 10:00 AM',
        languageCode: 'en',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent:');
    const result = responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);
    console.log(`Intent: ${result.intent.displayName}`);
    console.log(`Confidence: ${result.intentDetectionConfidence}`);
    console.log(`Parameters: ${JSON.stringify(result.parameters)}`);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

runSample();
