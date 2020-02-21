var util     = require('utile');
var events   = require('events');
var mongoose = require('mongoose');

function M() {
    events.EventEmitter.call(this);
}

var host     = 'localhost';
var db_name  = 'firstapp';
var db       = mongoose.connect('mongodb://' + host + '/' + db_name, { useNewUrlParser: true, useUnifiedTopology: true });

var Schema = mongoose.Schema;
var Post   = new Schema({
    text    : String,
    created : { type : Date   , default  : Date.now }
});



exports.Post = db.model('Post', Post);
