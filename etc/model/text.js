var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/imaker');

function  validator(v) {
  return v.length > 0;
}

var Text = new mongoose.Schema({
  text    : { type: String, validate: [validator, "Empty Error"] },
  prj_id  : { type: Number },
  user_id : { type: Number },
  created : { type: Date, default: Date.now }
});

exports.Text = db.model('Text', Text);
