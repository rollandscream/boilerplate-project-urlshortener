require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var mongoose = require('mongoose');
const { json } = require('body-parser');
mongoose.connect(process.env.MONGO_URI);
var validator = require('validator');
const bodyParser = require('body-parser');

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
  shortUrl: Number
});

let urlShortened = mongoose.model('urlShortener', urlSchema);
let shortUrlInt = 0;

app.use("/api/shorturl", bodyParser.urlencoded({extended: false}));
//get long url from the post
app.post("/api/shorturl", function (req, res) {
  //check if it's format is ok
  console.log(req.body.url);
  if (!validator.isURL(req.body.url)) {
    //generate error response
    res.json({"error": "invalid url"});
  } else {
    //generate a number for a short url
    shortUrlInt++;
    //save to database
    var shortUrl = new urlShortened({longUrl: req.body.url, shortUrl: shortUrlInt});
    shortUrl.save()
            .then((doc) => console.log(doc))
            .catch((err) => console.error(err));
    res.json({"original_url": req.body.url, "short_url": shortUrlInt});
  }
})

//read short url from the query
app.get("/api/shorturl/:shorturl", function (req, res) {
  var urlToFind = parseInt(req.params.shorturl);
  //find it in the database
  urlShortened.find({shortUrl: urlToFind})
              .then((doc) => {
                //redirect to the long url
                res.redirect(doc[0]._doc.longUrl);
              })
              .catch((err) => console.log(err));
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
