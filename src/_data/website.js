const today= new Date();

module.exports = {
    env: process.env,
    branch: process.env.BRANCH || 'master',
    url: process.env.URL || 'http://localhost:8080',
    layout: 'default.njk',
    currentYear : today.getFullYear(),
    today: today
  };