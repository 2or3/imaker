var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/imaker', { useNewUrlParser: true, useUnifiedTopology: true });

function  validator(v) {
  return v.length > 0;
}

var Text = new mongoose.Schema({
  text    : { type: String, validate: [validator, "Empty Error"] },
  prj_id  : { type: Number },
  user_id : { type: Number },
  created : { type: Date, default: Date.now }
});

exports.Text = mongoose.model('Text', Text);
