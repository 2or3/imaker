// init_user_tbl.js
var mysql   = require('mysql');
var DB_NAME = 'fokuses_instant_maker';
var TABLE   = 'instant_maker_music';

// make mysql client
var client = mysql.createConnection({
    user: 'tsukasa',
    password: 'highjump2m'
});

// use database
client.query('USE ' + DB_NAME);

// drop table
client.query('DROP TABLE IF EXISTS ' + TABLE);

// create table
client.query(
    'CREATE TABLE IF NOT EXISTS ' + TABLE + '('                     +
        'id         INT          UNSIGNED NOT NULL AUTO_INCREMENT,' +
        'name       VARCHAR(100)          NOT NULL,'                +
        'file_path  VARCHAR(255)          NOT NULL,'                +
        'mtime      TIMESTAMP             NOT NULL,'                +
        'ctime      DATETIME              NOT NULL,'                +
        'PRIMARY KEY (id),'                                         +
        'KEY (name)'                                                +
    ')'
);

// close connection
client.end();
