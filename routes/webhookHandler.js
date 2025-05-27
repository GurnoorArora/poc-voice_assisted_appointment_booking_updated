const e = require('express');
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
    const rawTime = time;
    const name = person.name;

    const newtime = new Date(rawTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (!name || !date || !time) {
      return res.json({
        fulfillmentText: 'Missing required details to book an appointment.',
      });
    }

    const row = `${name},${date},${newtime}\n`;

    // Create file with header if it doesn't exist
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

      // Respond to Dialogflow
      res.json({
        fulfillmentText: `Appointment booked for ${name} on ${date} at ${newtime}.`,
      });

      // Log the updated file for debugging
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (!err) {
          console.log("📄 Updated Appointments CSV:\n" + data);
        }
      });
    });
  }
  else if (intent === 'checkAppointment') {
    const userEmail = "johndoe@example.com"; // Assuming user is logged in
    const today = new Date().toISOString().split("T")[0];
  
    const appointments = findAllAppointments(userEmail); // Should return an array of appointment objects
  
    // Filter for upcoming appointments
    const upcomingAppointments = appointments.filter(appointment => {
     return appointment.date >= today;
    });

    let responseText;

    if (upcomingAppointments.length > 0) {
      responseText = "Here are your upcoming appointments:\n";
      upcomingAppointments.forEach(appointment => {
        responseText += `- ${appointment.name} on ${appointment.date} at ${appointment.time}\n`;
     });
   } else {
      responseText = "You have no upcoming appointments.";
    }

    return res.json({
     fulfillmentText: responseText,
    });
  }


  else {
    return res.json({
      fulfillmentText: "Sorry, I can't handle that request yet.",
    });
  }
});

module.exports = router;
