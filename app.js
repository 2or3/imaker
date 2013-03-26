
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , enter  = require('./routes/enter')
  , chat = require('./routes/chat')
  , user = require('./routes/user')
  , view = require('./routes/view')
  , http = require('http')
  , path = require('path')
  , sio  = require('socket.io')
  , file = require('./routes/upload');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
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
app.post('/upload', file.upload);

io.sockets.on('connection', chat.chat);

