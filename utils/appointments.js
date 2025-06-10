const fs = require('fs');
const path = require('path');
const { formatDate } = require('./format_date');

const filePath = path.join(__dirname, '../appointments.csv');

function findAllAppointments(userEmail) {
  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.trim().split('\n');

  const appointments = lines.slice(1).map(line => {
    const [name, date, time, email] = line.split(',');
    
    return { name, date, time, email };
  });

  return appointments.filter(app => app.email === userEmail);
}


module.exports = { findAllAppointments };
