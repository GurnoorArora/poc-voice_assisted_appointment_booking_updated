const express = require('express');
const axios = require('axios');
const router = express.Router();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.post('/', async (req, res) => {
    const userMessage = req.body.message;
    console.log('User message:', userMessage);

    try {
        
        const flaskResponse = await axios.post('https://hrb-nlu-production.up.railway.app/nlu', {
            text: userMessage,
            session_id: 'user123'
        });

        const nluData = flaskResponse.data;
        console.log('NLU Response:', nluData);

       
        if (nluData.allRequiredParamsPresent) {
            const actionResponse = await axios.post('http://localhost:3000/handleAppointment', {
                intent: nluData.intent,
                slots: nluData.slots
            });
            console.log('Action Response:', actionResponse.data);
            
            return res.json({
                reply: actionResponse.data.message,
                intent: nluData.intent,
                slots: nluData.slots
            });
        }

        
        return res.json({
            reply: nluData.message,
            intent: nluData.intent,
            slots: nluData.slots,
            missing_slots: nluData.missing_slots || []
        });

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Something went wrong.' });
    }
});

module.exports = router;
