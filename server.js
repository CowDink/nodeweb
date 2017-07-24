const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const con = require('dotenv');

con.load();

const path = __dirname + '/views';

const app = express();

let db;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname+'/assets'));

app.set('view engine', 'pug');

app.get("/test", (req, res) => {
    res.send(process.env.DB_URI);
});

// Root Gateway
app.get('/', (req, res) => {
    db.collection('kamut').find().toArray((err, result) => {
        if(err) return console.log(err);
        res.render("index", {
            kamut:result
        });
    });
});

// puisi
app.get('/insert/kata_mutiara', (req, res) => {
    res.render("insert_kamut");
});

// Insert puisi
app.post('/insert/kamut_process', (req, res) =>{
    console.log(req.body);
    db.collection('kamut').save(req.body, (err, result) => {
        if(err) return console.log(err);
        console.log("data saved");
        res.redirect('/');
    });
});

// Create server
MongoClient.connect(process.env.DB_URI, (err, database) => {
    if(err) return console.log(err);
    db = database;
    app.listen('3000', () => {
        console.log("server working on port 3000");
    });
});
