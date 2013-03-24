// init_db.js
var mysql   = require('mysql');
var DB_NAME = 'fokuses_instant_maker';

// make mysql client
var client = mysql.createConnection({
    user: 'tsukasa',
    password: 'highjump2m'
});

// create database
client.query('CREATE DATABASE IF NOT EXISTS ' + DB_NAME);

// close connection
client.end();
