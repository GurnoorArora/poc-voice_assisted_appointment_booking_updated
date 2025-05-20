const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../appointments.csv');


router.post('/', (req, res) => {
    const { name, date, time } = req.body;
    if (!name || !date || !time) {
        return res.status(400).send('Missing name, date or time');
    }

    const row = `${name},${date},${time}\n`;

    // If file doesn't exist, create it with a header
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'name,date,time\n');
    }

    fs.appendFile(filePath, row, (err) => {
        if (err) {
            console.error('Failed to write appointment:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Appointment Booked');
    });
});

module.exports = router;
