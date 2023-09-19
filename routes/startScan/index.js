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

    res.render('startScan', { data: data, error: error });
});

router.post('/', (req, res) => {
    const email = req.body.email;

    const qry = 'Select id from email Where email = ?'
    db.get(qry, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error while fetching user from the database' });
        }
        console.log(user)
        if (!user) {
            let errors = [];

            if (req.body.email) {
                var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                var valideer = req.body.email.match(regex);
                if (!valideer) {
                    errors.push("email moet tenminste een @ hebben");
                }
            } else {
                errors.push("Geen email ingevuld")
            }
            if (errors.length) {
                res.status(400);
                const errorString = encodeURIComponent(errors.join(', ')); // Join the errors into a single string
                res.redirect('/startScan?error=' + errorString); // Redirect with the 'error' parameter
                return;
            }


            let params = [
                req.body.email
            ];
            let qry2 = `INSERT INTO "email"
            (email)
            VALUES (?)`;
            db.run(qry2, params, function (err) {
                if (err) {
                    res.status(400).json({ error: err.message });
                    var string = encodeURIComponent(error);
                    res.redirect('/startScan?error' + string);
                    return;
                }
                res.status(200);
                var string = encodeURIComponent(req.body.email);
                res.redirect('/startScan?data=' + string);

            });

        } else {
            // Create JWT
            // Create JWT token with user information
            const token = jwt.sign({ user }, secret, { expiresIn: '1h' });

            // Set cookie with JWT token
            res.cookie('session', token, { httpOnly: true });
            res.status(200)
            res.redirect('question');
        }

    })


});


module.exports = router;