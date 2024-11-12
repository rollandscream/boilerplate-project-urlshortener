require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var mongoose = require('mongoose');
const { json } = require('body-parser');
mongoose.connect(process.env.MONGO_URI);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.json());

const Schema = mongoose.Schema;

let urlSchema = new Schema({
  longUrl: String,
  shortUrl: String
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
