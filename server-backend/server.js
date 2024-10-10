const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router');  // Import the router

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use the router for handling user-related routes
app.use('/api', router);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
