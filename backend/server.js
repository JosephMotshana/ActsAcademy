// Local server bootstrap for development
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

db.query('SELECT 1')
  .then(() => {
    console.log('Successfully connected to MySQL database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MySQL database:', err.message);
  });