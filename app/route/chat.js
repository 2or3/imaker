var model = require('../models/model/text.js'),
    fs    = require('fs');;
var Text  = model.Text;

var master = [];
var img_nm = 0;
master.is_master = false;
exports.users = {};
exports.messages = [];
exports.chat = function(client) {
  var users = exports.users;
  var messages = exports.messages;
  var io = exports.io;

  client.on('login', function(user) {
    var is_login = users[user];
    if (is_login) {
      io.sockets.emit('error', 'error');
      return false;
    }
    console.log(users);
    users[user] = user;
    client.user = user;
    io.sockets.emit('updateLoginUsers', users);
    var msg = client.user + 'さんがログインしました!';
    for (var key in messages) {
      client.emit('res', messages[key]['user'], messages[key]['msg']);
    }
    // messages.push({'user':'system', 'msg':msg});
    // io.sockets.emit('res', 'system', msg);
  });

  client.on('chat', function(from, msg) {
    console.log('メッセージを送信しました。(from=' + from + ', msg=' + msg + ')');
    var data = {
      text: msg,
      prj_id: 1,
      user_id: 1
    }
    var createText = new Text(data);
    createText.save(function(err) {
      console.log(err);
    });

    messages.push({'user':from, 'msg':msg});
    io.sockets.emit('res', from, msg);
  });

  client.on('disconnect', function() {
    console.log(client.sessionId + 'が切断しました。');
    delete users[client.user];
    io.sockets.emit('updateLoginUsers', users);
    var msg = client.user + 'さんがログアウトしました...';
    // io.sockets.emit('res', 'system', msg);
    // messages.push({'user':'system', 'msg':msg});
    if (master.user_id == client.id) {
      master.is_master = false;
      master.user_id   = '';
    }
  });

  client.on('getImg', function() {
    var fo = fs.readdirSync('./public/images/tmp/');
    var num = (Math.floor(Math.random() * fo.length));
    if (img_nm == num && num < (fo.length - 1) ) {
      num++;
    } else if (img_nm == num && num > 0) {
      num--;
    }
    img_nm = num;
    var file = fo[num];
    io.sockets.emit('roadImg', 'images/tmp/' + file);
  });

  client.on('init', function() {
    console.log(master.user_id);
    if (master.is_master == false) {
      master.is_master = true;
      master.user_id   = client.id;
      io.sockets.emit('isMaster', true);
    } else {
      io.sockets.emit('isMaster', false);
    }
  });
};
