const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config.js');
const checkLogin = require('../auth/isLoggedIn.js');

//import model objects
const Teach = require('../model/teacher.js');
const Stud = require('../model/student.js');


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);//attach body-parser middleware
app.use(bodyParser.json());//parse json data

//Allow communication between domains
const cors = require("cors");
app.use(cors());

//Login
app.post("/login/", (req, res) => {
  console.log("TEST abc 123")
    // var {username, password} = req.body;
    typeUser = req.body.type;
    if (typeUser == 'Teacher') {
        Teach.verifyTeach(req.body.email, req.body.password, (error, teach) => {
            if (error) {
                res.status(500).send();
                return;
            }
            if (teach === null) {
                res.status(401).send();
                return;
            }
    
            const payload = { user_id: teach.teacher_id};
            jwt.sign(payload, jwtSecret, { algorithm: "HS256" }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send();
                    return;
                }
                console.log(teach.teacher_id)
                res.status(200).send({
                    token: token,
                    user_id: teach.teacher_id
                });
            })
        });
    } else {
        Stud.verifyStud(req.body.email, req.body.password, (error, stud) => {
            if (error) {
                res.status(500).send();
                return;
            }
            if (stud === null) {
              res.setHeader('WWW-Authenticate', 'Basic realm="Authentication required"');
              res.status(401).send('Unauthorized');
              return;
            }
    
            const payload = { user_id: stud.student_id};
            jwt.sign(payload, jwtSecret, { algorithm: "HS256" }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send();
                    return;
                }
                console.log(stud.student_id)
                res.status(200).send({
                    token: token,
                    user_id: stud.student_id
                });
            })
        });
    }
});

//Add Customer
app.post('/customers', checkLogin, (req, res) => {

    cusObject = req.body;
    console.log(cusObject);

    Cus.addCus(cusObject, (error, data) => {
        console.log(error, data);
        if (error=='missing') {
            res.status(400).send({"error_msg":"missing data"});
        } else if (error=='duplicate') {
            res.status(409).send({"error_msg":"email already exist"});
        } else if (error) {
            res.status(500).send({"error_msg":"Internal server error"});
        } else {
            res.status(201).send({"customer_id": data.insertId});
        }
    });
});


module.exports = app;