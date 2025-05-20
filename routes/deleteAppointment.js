const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../appointments.csv');

router.delete('/', (req, res) => {
    const { name, date, time } = req.body;

    if (!name || !date || !time) {
        return res.status(400).send('Missing name, date, or time');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read CSV:', err);
            return res.status(500).send('Internal Server Error');
        }

        const lines = data.trim().split('\n');
        const headers = lines[0];

        let found = false;
        const updatedLines = lines.filter((line, idx) => {
            if (idx === 0) return true; // Keep header

            const [n, d, t] = line.split(',');
            const isMatch = n === name && d === date && t === time;

            if (isMatch) {
                found = true;
                return false; // Skip this line (i.e., delete it)
            }
            return true;
        });

        if (!found) {
            return res.status(404).send('Appointment not found');
        }

        fs.writeFile(filePath, updatedLines.join('\n') + '\n', err => {
            if (err) {
                console.error('Failed to update CSV:', err);
                return res.status(500).send('Error deleting appointment');
            }
            res.send('Appointment deleted');
        });
    });
});

module.exports = router;
