const fs = require('fs');
const path = require('path');
const { formatDate } = require('./format_date');

const filePath = path.join(__dirname, '../appointments.csv');

function deleteUserAppointments({ name, dateTime, email }) {
  if (!fs.existsSync(filePath)) {
    return { success: false, message: 'There are no appointments to delete.' };
  }

  const csv = fs.readFileSync(filePath, 'utf8');
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const [n, d, t, e] = line.split(',');
    return { name: n, date: d, time: t, email: e };
  });

  const userAppointments = data.filter(app => app.email === email);

  if (userAppointments.length === 0) {
    return { success: false, message: 'You have no appointments to delete.' };
  }

  if (userAppointments.length === 1) {
    const updated = data.filter(app => !(app.email === email));
    const newCSV = [headers.join(',')].concat(updated.map(app => `${app.name},${app.date},${app.time},${app.email}`)).join('\n');
    fs.writeFileSync(filePath, newCSV);

    const formatted = formatDate(userAppointments[0].date);
    return {
      success: true,
      deleted: true,
      message: `Your appointment for ${userAppointments[0].name} on ${formatted} at ${userAppointments[0].time} has been deleted.`,
    };
  } else {
    const formattedList = userAppointments.map((a, i) => {
      const formatted = formatDate(a.date);
      return `${i + 1}. ${a.name} on ${formatted} at ${a.time}`;
    }).join('\n');

    return {
      success: true,
      deleted: false,
      message: `You have ${userAppointments.length} appointments:\n${formattedList}\nWhich one would you like to delete?`,
    };
  }
}

module.exports = { deleteUserAppointments };
