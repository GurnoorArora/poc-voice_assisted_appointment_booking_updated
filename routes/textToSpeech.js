
const express = require('express');
const router = express.Router();
const axios = require('axios'); 

router.post('/', async (req, res) => {
    const text=req.body.text;
    const apiKey="AIzaSyDbRa0F4-LoNq15ckRo8S5t1iVI5Vl12y8";
    const endpoint=`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
    const payload={
    "audioConfig": {
    "audioEncoding": "LINEAR16",
    "effectsProfileId": [
    "small-bluetooth-speaker-class-device"
    ],
    "pitch": 0,
    "speakingRate": 1
  },
  "input": {
    "text": `${text}`
  },
  "voice": {
      "languageCode": "en-US",
        "name": "en-US-Chirp3-HD-Achernar"
    }
    }

    const response=await axios.post(endpoint, payload)
    res.json(response.data);
})

module.exports = router;