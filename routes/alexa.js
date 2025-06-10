// routes/alexa.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const spokenText = req.body?.request?.intent?.slots?.query?.value;
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
        // Send message to your NLU backend
        const flaskResponse = await axios.post('https://your-flask-nlu.up.railway.app/nlu', {
            text: spokenText,
            session_id: sessionId
        });

        const nluData = flaskResponse.data;
        let finalMessage = nluData.message;

        // Optional: call action handler if all slots filled
        if (nluData.allRequiredParamsPresent) {
            const actionResponse = await axios.post('https://your-node-backend.up.railway.app/handleAppointment', {
                intent: nluData.intent,
                slots: nluData.slots
            });
            finalMessage = actionResponse.data.message;
        }

        // Reply to Alexa
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
                    text: "Sorry, there was a problem processing your request."
                },
                shouldEndSession: true
            }
        });
    }
});

module.exports = router;
