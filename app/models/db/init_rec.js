// init_user_tbl.js
var mysql   = require('mysql');
var DB_NAME = 'fokuses_instant_maker';
var TABLE   = 'instant_maker_rec';

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
    'CREATE TABLE IF NOT EXISTS ' + TABLE + '('                  +
        'id         INT       UNSIGNED NOT NULL AUTO_INCREMENT,' +
        'tag_id     INT       UNSIGNED NOT NULL,'                +
        'instant_id BIGINT    UNSIGNED NOT NULL,'                +
        'mtime      TIMESTAMP          NOT NULL,'                +
        'ctime      DATETIME           NOT NULL,'                +
        'PRIMARY KEY (id),'                                      +
        'KEY (tag_id),'                                          +
        'KEY (instant_id)'                                       +
    ')'
);

client.query(
    'insert into instant_maker_rec(tag_id, instant_id, mtime, ctime) value (1, 1, now(), now());'
);
client.query(
    'insert into instant_maker_rec(tag_id, instant_id, mtime, ctime) value (1, 2, now(), now());'
);
client.query(
    'insert into instant_maker_rec(tag_id, instant_id, mtime, ctime) value (2, 1, now(), now());'
);
client.query(
    'insert into instant_maker_rec(tag_id, instant_id, mtime, ctime) value (3, 1, now(), now());'
);
client.query(
    'insert into instant_maker_rec(tag_id, instant_id, mtime, ctime) value (4, 1, now(), now());'
);
client.query(
    'insert into instant_maker_rec(tag_id, instant_id, mtime, ctime) value (4, 2, now(), now());'
);

// close connection
client.end();
