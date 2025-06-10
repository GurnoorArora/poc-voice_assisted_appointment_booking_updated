// routes/alexa.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("==== Alexa POST Body ====");
    console.dir(req.body, { depth: null }); // Full request log

    const spokenText = req.body?.request?.intent?.slots?.utterance?.value; // FIXED THIS
    const sessionId = req.body?.session?.user?.userId || 'anonymous';

    console.log('Alexa said:', spokenText);

    if (!spokenText) {
        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "I didn’t catch that. Please say it again."
                },
                shouldEndSession: false
            }
        });
    }

    try {
        const flaskResponse = await axios.post('https://hrb-nlu-production.up.railway.app/nlu', {
            text: spokenText,
            session_id: sessionId
        });

        const nluData = flaskResponse.data;
        let finalMessage = nluData.message;

        if (nluData.allRequiredParamsPresent) {
            const actionResponse = await axios.post('http://localhost:3000/handleAppointment', {
                intent: nluData.intent,
                slots: nluData.slots
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
        console.error('Error:', err.message);
        return res.json({
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "Sorry, something went wrong."
                },
                shouldEndSession: true
            }
        });
    }
});

module.exports = router;
