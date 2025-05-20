const express = require('express');
const webhookHandler = require('./routes/webhookHandler');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const insertAppointment=require('./routes/insertAppointment')
const deleteAppointment=require('./routes/deleteAppointment')
const updateAppointment=require('./routes/updateAppointment')
const viewAppointment = require('./routes/viewAppointment');
app.use(bodyParser.json());
app.use('/viewAppointment', viewAppointment);
app.use('/webhook', webhookHandler);
app.use('/insertAppointment',insertAppointment)
app.use('/deleteAppointment',deleteAppointment)
app.use('/updateAppointment',updateAppointment)

app.get('/', (req, res) => {
  res.send('Voice Assistant Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


