/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./route')
    , enter  = require('./route/enter')
    , chat = require('./route/chat')
    , view = require('./route/view')
    , http = require('http')
    , path = require('path')
    , sio  = require('socket.io')
    , bodyParser  = require('body-parser')
    , methodOverride  = require('method-override')
    , multer = require('multer');

const upload = multer({ dest: 'public/images/tmp/' });

var app = module.exports = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true, uploadDir:'./uploads'}));
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(function(err, req, res, next) {});

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

// var fs = require('fs');
app.post('/upload', upload.single('image'), function(req, res, next) {
    var target_path = './public/images/tmp/' + req.file.originalname;
    res.redirect('/?upload=true&img=' + target_path);
});

io.sockets.on('connection', chat.chat);

