const express = require('express');
const webhookHandler = require('./routes/webhookHandler');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors()); // Allow all origins
const insertAppointment = require('./routes/insertAppointment')
const deleteAppointment = require('./routes/deleteAppointment')
const updateAppointment = require('./routes/updateAppointment')
const viewAppointment = require('./routes/viewAppointment');
const detectIntent = require('./routes/detectIntent');
const textToSpeech = require('./routes/textToSpeech');
const alexaRouter = require('./routes/alexa');
const hrbApi = require('./routes/hrb_api');
app.use(bodyParser.json());
app.use('/detectIntent', detectIntent);
app.use('/viewAppointment', viewAppointment);
app.use('/webhook', webhookHandler);
app.use('/insertAppointment', insertAppointment)
app.use('/deleteAppointment', deleteAppointment)
app.use('/updateAppointment', updateAppointment)
app.use('/alexa', alexaRouter);
app.use('/synthesize', textToSpeech);
app.use('/hrbApi', hrbApi);
app.use('/detectIntentCustomNLU', require('./routes/detectIntent_custom_nlu'));
app.use('/handleAppointment', require('./routes/handleAppointment'));
app.use('/receiveText', require('./routes/receive_text'));
app.use('/updateAlexa', require('./routes/updated_alexa'));
app.get('/', (req, res) => {
  res.send('Voice Assistant Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


