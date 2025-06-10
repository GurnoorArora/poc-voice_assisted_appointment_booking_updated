const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { formatDate } = require('../utils/format_date');
const { findAllAppointments } = require('../utils/appointments');
const { deleteUserAppointments } = require('../utils/deleteAppointment');

const filePath = path.join(__dirname, '../appointments.csv');

router.post('/', (req, res) => {
  const { intent, slots } = req.body;
  console.log('slots:', slots);
  const email = "johndoe@example.com"; // Simulated user identity
  console.log('Received request:', req.body);

  if (intent === 'insertAppointment') {
    const { name, date, time } = slots;

    if (!name || !date || !time) {
      return res.json({ message: 'Missing required details to book an appointment.' });
    }

    // Parse 12-hour time format like "03:00 PM"
    const parsedTime = Date.parse(`1970-01-01 ${time}`);
    if (isNaN(parsedTime)) {
      return res.json({ message: 'Invalid time format. Please use hh:mm AM/PM format.' });
    }

    const formattedTime = new Date(parsedTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const row = `${name},${date},${formattedTime},${email}\n`;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'name,date,time,email\n');
    }

    fs.appendFile(filePath, row, (err) => {
      if (err) {
        console.error('Failed to write appointment:', err);
        return res.json({ message: 'Failed to book the appointment. Please try again.' });
      }

      const formattedDate = formatDate(date);
      return res.json({
        message: `Appointment booked for ${name} on ${formattedDate} at ${formattedTime}.`
      });
    });
  }

  else if (intent === 'checkAppointment') {
    const today = new Date().toISOString().split("T")[0];
    const appointments = findAllAppointments(email);

    const upcoming = appointments.filter(a => a.date >= today);
    if (upcoming.length === 0) {
      return res.json({ message: "You have no upcoming appointments." });
    }

    let response = "Here are your upcoming appointments:\n";
    upcoming.forEach(a => {
      response += `- ${a.name} on ${formatDate(a.date)} at ${a.time}\n`;
    });

    return res.json({ message: response });
  }

  else if (intent === 'deleteAppointment') {
    const { name, date } = slots;
    const result = deleteUserAppointments({ name, dateTime: date, email });

    return res.json({ message: result.message });
  }

  else {
    return res.json({ message: "Sorry, I can't handle that request yet." });
  }
});

module.exports = router;
