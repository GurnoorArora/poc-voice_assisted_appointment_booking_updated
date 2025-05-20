const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../appointments.csv');

router.post('/', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;

  // Only handle Insert Appointment for now
  if (intent === 'InsertAppointment') {
    const { person, date, time } = params;
    const rawTime=time;
    const name = person.name;
    
   const newtime = new Date(rawTime).toLocaleTimeString('en-IN', {
   hour: '2-digit',
   minute: '2-digit',
   hour12: true
    });


    if (!name || !date || !time) {
      return res.json({
        fulfillmentText: 'Missing required details to book an appointment.',
      });
    }

    const row = `${name},${date},${newtime}\n`;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'name,date,time\n');
    }

    fs.appendFile(filePath, row, (err) => {
      if (err) {
        console.error('Failed to write appointment:', err);
        return res.json({
          fulfillmentText: 'Failed to book the appointment. Please try again.',
        });
      }

      return res.json({
        fulfillmentText: `Appointment booked for ${name} on ${date} at ${time}.`,
      });

    fs.readFile(filePath, 'utf8', (err, data) => {
  if (!err) {
    console.log("📄 Updated Appointments CSV:\n" + data);
  }
});

    });
  } else {
    return res.json({
      fulfillmentText: "Sorry, I can't handle that request yet.",
    });
  }
});

module.exports = router;
