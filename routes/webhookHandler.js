const e = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const {formatDate} = require('../utils/format_date');
const {findAllAppointments}=require('../utils/appointments');
const { deleteUserAppointments } = require('../utils/deleteAppointment');


const filePath = path.join(__dirname, '../appointments.csv');

router.post('/', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;

  // Only handle Insert Appointment for now
  if (intent === 'InsertAppointment') {
    let { person, date, time } = params;
    const rawTime = time;
    const name = person.name;

    const newtime = new Date(rawTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const defaultEmail = "johndoe@example.com"; // Simulated logged-in user


    if (!name || !date || !time) {
      return res.json({
        fulfillmentText: 'Missing required details to book an appointment.',
      });
    }
     const row = `${name},${date},${newtime},${defaultEmail}\n`;

    // Create file with header if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'name,date,time,email\n');
    }

    fs.appendFile(filePath, row, (err) => {
      if (err) {
        console.error('Failed to write appointment:', err);
        return res.json({
          fulfillmentText: 'Failed to book the appointment. Please try again.',
        });
      }
     let formatted_date=formatDate(date);
      
      // Respond to Dialogflow
      res.json({
        fulfillmentText: `Appointment booked for ${name} on ${formatted_date} at ${newtime}.`,
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
        let formatted_date = formatDate(appointment.date);
        responseText += `- ${appointment.name} on ${formatted_date} at ${appointment.time}\n`;
     });
   } else {
      responseText = "You have no upcoming appointments.";
    }
    
    return res.json({
     fulfillmentText: responseText,
    });
  }
  else if (intent === 'deleteAppointment') {
  const name = params['person']?.name;
  const dateTime = params['date-time'];
  const email = "johndoe@example.com"; // Simulated user identity
  const result = deleteUserAppointments({ name, dateTime, email });
  // If result.deleted is true, an appointment was removed — send confirmation
  if (result.success && result.deleted) {
    return res.json({
      fulfillmentText: result.message
    });
  }

  // If multiple appointments exist, store them in context for follow-up
  if (result.success && !result.deleted) {
    const userAppointments = result.message
      .split('\n')
      .slice(1, -1) // Extract just the numbered entries
      .map(entry => {
        const [index, rest] = entry.split('. ');
        const [name, rest2] = rest.split(' on ');
        const [date, time] = rest2.split(' at ');
        return { name, date, time };
      });

    return res.json({
      fulfillmentText: result.message,
      outputContexts: [
        {
          name: `${req.body.session}/contexts/awaiting_delete_choice`,
          lifespanCount: 2,
          parameters: {
            email,
            options: userAppointments
          }
        }
      ]
    });
  }

  // Catch-all fallback
  return res.json({
    fulfillmentText: result.message
  });
}
else if (intent === 'deleteAppointment-specific') {
  const params = req.body.queryResult.parameters;
  const contexts = req.body.queryResult.outputContexts;
  console.log("Contexts:", contexts);
  /*const context = contexts.find(c => c.name.endsWith('/contexts/awaiting_delete_choice'));

  const selectedIndex = parseInt(params['ordinal'] || params['number']); // e.g., "second one" → 2
  const email = context?.parameters?.email;

  if (!email || !selectedIndex) {
    return res.json({ fulfillmentText: "Sorry, I couldn't understand your selection." });
  }

  const result = deleteSpecificAppointment({ email, index: selectedIndex });*/

  return res.json({ fulfillmentText: 'youre in delete specific' });
}


  else {
    return res.json({
      fulfillmentText: "Sorry, I can't handle that request yet.",
    });
  }
});

module.exports = router;
