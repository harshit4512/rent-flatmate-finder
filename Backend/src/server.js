require("dotenv").config();

const app = require("./app");
const db=require('./config/db');

const PORT = process.env.PORT || 5000;

db.query('SELECT 1')
  .then(() => console.log('✅ MySQL connected successfully'))
  .catch((err) => console.error('❌ MySQL connection failed:', err.message));
  
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});