// init_user_tbl.js
var mysql   = require('mysql');
var DB_NAME = 'fokuses_instant_maker';
var TABLE   = 'instant_maker_text';

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
        'text       TEXT                  NOT NULL,'                +
        'author     VARCHAR(100)          NOT NULL,'                +
        'mtime      TIMESTAMP             NOT NULL,'                +
        'ctime      DATETIME              NOT NULL,'                +
        'PRIMARY KEY (id),'                                         +
        'KEY (author)'                                              +
    ')'
);

// close connection
client.end();
