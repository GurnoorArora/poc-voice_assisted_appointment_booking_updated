const fs = require('fs');
const path = require('path');
const { formatDate } = require('./formatDate');

const filePath = path.join(__dirname, '../appointments.csv');

function deleteSpecificAppointment({ email, index }) {
  if (!fs.existsSync(filePath)) {
    return { success: false, message: 'No appointments found.' };
  }

  const csv = fs.readFileSync(filePath, 'utf8');
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const [n, d, t, e] = line.split(',');
    return { name: n, date: d, time: t, email: e };
  });

  const userAppointments = data.filter(app => app.email === email);

  if (index < 1 || index > userAppointments.length) {
    return { success: false, message: 'Invalid selection.' };
  }

  const toDelete = userAppointments[index - 1];
  const updated = data.filter(app =>
    !(app.name === toDelete.name &&
      app.date === toDelete.date &&
      app.time === toDelete.time &&
      app.email === email)
  );

  const newCSV = [headers.join(',')].concat(
    updated.map(app => `${app.name},${app.date},${app.time},${app.email}`)
  ).join('\n');

  fs.writeFileSync(filePath, newCSV);

  const formatted = formatDate(toDelete.date);
  return {
    success: true,
    message: `Your appointment with ${toDelete.name} on ${formatted} at ${toDelete.time} has been deleted.`
  };
}
module.exports={deleteSpecificAppointment}

