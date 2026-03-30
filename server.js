require('dotenv').config();
const express = require('express')
const app = express();
const db=require('./db');
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