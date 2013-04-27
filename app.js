/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , enter  = require('./routes/enter')
  , chat = require('./routes/chat')
  , view = require('./routes/view')
  , http = require('http')
  , path = require('path')
  , sio  = require('socket.io');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, '/public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io  = sio.listen(server);
enter.io = io;
chat.io = io;

// routing
app.get('/', routes.index);
app.post('/enter', enter.enter);
app.get('/enter', routes.index);
app.get('/view', view.view);
// app.post('/upload', upload.upload);

var fs = require('fs');
app.post('/upload', function(req, res) {
  var tmp_path = req.files.upfile.path;
  var file_state = fs.readdirSync('./public/images/tmp');
  var file = typeof(req.files.upfile) !== "undefined" ? req.files.upfile : false;
  console.log(file);
  try {
    validateImgFile(file);
    var file_count = file_state.length;
    var a = req.files.upfile.name.split(".");
    var ext = a[a.length - 1];
    var target_path = './public/images/tmp/' + file_count + '.' + ext;
    fs.rename(tmp_path, target_path, function(err) {
      fs.unlink(tmp_path, function() {
        res.redirect('/?upload=true&img=' + target_path);
      });
    });
  } catch(e) {
    console.log(e);
    res.redirect('/?upload=false');
  }
});

io.sockets.on('connection', chat.chat);

function validateImgFile(file_obj) {
  if (!file_obj.name) throw "file not found";
  if (!file_obj.type.match(/image\/*/)) throw "file is not image file";
  if (file_obj.size < 1000 || file_obj.size > 10000000) throw "file size is invalid";
  return true;
}
