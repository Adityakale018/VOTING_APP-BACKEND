require('dotenv').config();
const express = require('express')
const app = express();
const db=require('./db');

// Allow cross-origin requests from the frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
const {jwtMiddleware} = require('./jwt');

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port 300`)
})