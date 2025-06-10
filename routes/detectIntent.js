const express = require('express');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const axios = require('axios'); // Add this to forward response
const router = express.Router();

const CREDENTIALS_PATH = 'C:/OneDrive - H&R BLOCK LTD/Desktop/poc-voice_assisted_appointment_booking/credential.json';
const PROJECT_ID = 'hrb-assisstant-ijfe';

router.post('/', async (req, res) => {
  const userMessage = req.body.message;
  console.log('User message:', userMessage);
  const sessionId = "123456";

  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: CREDENTIALS_PATH,
  });

  const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userMessage,
        languageCode: 'en',
      },
    },
  };
 // console.log('Request:', request);

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    
    //console.log('Response:', result);
   
  if (!result.allRequiredParamsPresent) {
       return res.json({
              reply: result.fulfillmentText
        });
       }

   function simplifyParams(fields) {
    const out = {};
      for (const key in fields) {
        const value = fields[key];
       if (value.stringValue) {
         out[key] = value.stringValue;
       } else if (value.structValue) {
         out[key] = simplifyParams(value.structValue.fields);
       } else if (value.listValue) {
          out[key] = value.listValue.values.map(item => item.stringValue || null);
        } else {
          out[key] = null;
        }
     }
       return out;
        }

    const simplifiedResult = {
   intent: result.intent,
   parameters: simplifyParams(result.parameters.fields),
      };
     // console.log('Simplified Result:', simplifiedResult);

    const webhookResponse = await axios.post('http://localhost:3000/webhook', {
     queryResult: simplifiedResult
        });
       
      //  console.log('Webhook Response:', webhookResponse);
  



    res.json({
      query: result.queryText,
      response: webhookResponse.data.fulfillmentText,
      intent: result.intent.displayName,
      parameters: result.parameters.fields,
    });
    


  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ reply: "Internal server error: unable to process your request." });

  }
});

module.exports = router;

