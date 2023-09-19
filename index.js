
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SECRET_KEY;


app.use('/static', express.static(path.join(__dirname, 'public')));
app.engine('.html', require('ejs').__express);

const startScan = require('./routes/startScan');


app.use(express.json());
app.use(express.urlencoded());

app.use('/startScan', startScan);


app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (request, response) => {
    response.render('index');

});
//gets you the token where the users info is stored
app.get('/secure', (req, res) => {
    // get token from request
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized, token is missing'
      });
    }
  
    if (!token.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Unauthorized, token is invalid'
      });
    }
    // Removing Bearer from the token
    token = token.slice(7, token.length);
    // verify token
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send({ error: 'Invalid token' });
      } else {
  
        res.json({ message: 'success', decoded });
      }
    });
  });
     
    app.use("/", router);
    app.listen(process.env.port || 3005);
     
    console.log("Running at Port 3005");


app.use(express.static(path.join(__dirname, 'public')));
