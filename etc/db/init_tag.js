// init_user_tbl.js
var mysql   = require('mysql');
var DB_NAME = 'fokuses_instant_maker';
var TABLE   = 'instant_maker_tag';

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
        'tag        VARCHAR(255)          NOT NULL,'                +
        'user_id    BIGINT                NOT NULL,'                +
        'mtime      TIMESTAMP             NOT NULL,'                +
        'ctime      DATETIME              NOT NULL,'                +
        'PRIMARY KEY (id),'                                         +
        'KEY (tag),'                                                +
        'KEY (user_id)'                                             +
    ')'
);

// close connection
client.end();
