// routes/alexa.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("==== Alexa Request ====");
    console.dir(req.body, { depth: null });

    const requestType = req.body?.request?.type;
    const sessionId = req.body?.session?.user?.userId || 'anonymous';

    // Handle initial launch: "Alexa, open tax scheduler"
    if (requestType === 'LaunchRequest') {
        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "Welcome to the tax scheduler. How can I assist you today?"
                },
                shouldEndSession: false
            }
        });
    }

    // Handle IntentRequest: spoken utterance via Alexa
    const spokenText = req.body?.request?.intent?.slots?.utterance?.value;

    if (!spokenText) {
        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "I didn’t catch that. Could you please say it again?"
                },
                shouldEndSession: false
            }
        });
    }

    console.log('Alexa spoke:', spokenText);

    try {
        // Step 1: Send to NLU
        const flaskResponse = await axios.post('https://hrb-nlu-production.up.railway.app/nlu', {
            text: spokenText,
            session_id: sessionId
        });

        const nluData = flaskResponse.data;
        let finalMessage = nluData.message;

        // Step 2: If all slots present, send to HRB API handler
        if (nluData.allRequiredParamsPresent) {
            const actionResponse = await axios.post('https://poc-voiceassistedappointmentbookingupdated-production.up.railway.app/hrbApi', {
                intent: nluData.intent,
                bookingPayload: nluData.booking_payload
            });

            finalMessage = actionResponse.data.message;
        }

        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: finalMessage
                },
                shouldEndSession: false
            }
        });

    } catch (err) {
        console.error('Alexa skill error:', err.message);
        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "Sorry, something went wrong while processing your request."
                },
                shouldEndSession: true
            }
        });
    }
});

module.exports = router;
