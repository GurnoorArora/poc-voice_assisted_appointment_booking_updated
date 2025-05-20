const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../appointments.csv');

router.post('/', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;

  // Only handle Insert Appointment for now
  if (intent === 'Insert Appointment') {
    const { name, date, time } = params;

    if (!name || !date || !time) {
      return res.json({
        fulfillmentText: 'Missing required details to book an appointment.',
      });
    }

    const row = `${name},${date},${time}\n`;

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
    });
  } else {
    return res.json({
      fulfillmentText: "Sorry, I can't handle that request yet.",
    });
  }
});

module.exports = router;
