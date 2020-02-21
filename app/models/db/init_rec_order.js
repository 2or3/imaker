// init_user_tbl.js
var mysql   = require('mysql');
var DB_NAME = 'fokuses_instant_maker';
var TABLE   = 'instant_maker_rec_order';

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
    'CREATE TABLE IF NOT EXISTS ' + TABLE + '('                    +
        'id           BIGINT    UNSIGNED NOT NULL AUTO_INCREMENT,' +
        'rec_id       INT       UNSIGNED NOT NULL,'                +
        'content_type TINYINT   UNSIGNED NOT NULL,'                +
        'content_id   INT       UNSIGNED NOT NULL,'                +
        'time_length  INT       UNSIGNED NOT NULL,'                +
        'mtime        TIMESTAMP          NOT NULL,'                +
        'ctime        DATETIME           NOT NULL,'                +
        'PRIMARY KEY (id),'                                        +
        'KEY (rec_id),'                                            +
        'KEY (content_type),'                                      +
        'KEY (time_length),'                                       +
        'KEY (content_id)'                                         +
    ')'
);

// close connection
client.end();
