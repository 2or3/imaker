// init_user_tbl.js
var mysql   = require('mysql');
var DB_NAME = 'fokuses_instant_maker';
var TABLE   = 'instant_maker_user';

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
    'CREATE TABLE IF NOT EXISTS ' + TABLE + '('                             +
        'id                 BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,' +
        'login_id           VARCHAR(255)          NOT NULL,'                +
        'name               VARCHAR(100)          NOT NULL,'                +
        'encrypted_password VARCHAR(255)          NOT NULL,'                +
        'mtime              TIMESTAMP             NOT NULL,'                +
        'ctime              DATETIME              NOT NULL,'                +
        'PRIMARY KEY (id),'                                                 +
        'KEY (login_id),'                                                   +
        'KEY (name),'                                                       +
        'KEY (encrypted_password)'                                          +
    ')'
);

client.query(
    'insert into instant_maker_user(login_id, name, encrypted_password, mtime, ctime) value ("aaa", "ss", sha1("a"), now(), now());'
);
client.query(
    'insert into instant_maker_user(login_id, name, encrypted_password, mtime, ctime) value ("a", "s", sha1("b"), now(), now());'
);
client.query(
    'insert into instant_maker_user(login_id, name, encrypted_password, mtime, ctime) value ("11", "22", sha1("3"), now(), now());'
);

// close connection
client.end();
