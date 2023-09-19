const express = require('express');
const router = express.Router();
const db = require("../../database/connection");
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const secret = process.env.SECRET_KEY;

router.get('/', (req, res) => {


    const data = req.query.data;
    const error = req.query.error;

    res.render('question', { data: data, error: error });
});