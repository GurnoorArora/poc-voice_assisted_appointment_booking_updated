const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../appointments.csv');

router.get('/', (req, res) => {
    if (!fs.existsSync(filePath)) {
        return res.json([]);
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read appointments:', err);
            return res.status(500).send('Internal Server Error');
        }
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');
        const appointments = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, idx) => {
                obj[header] = values[idx];
                return obj;
            }, {});
        });
        res.json(appointments);
    });
});

module.exports = router;