var model = require('/home/tsukasa/xfokuses/collarks/etc/model/text.js');
var Text  = model.Text;

var data = {
  text: 'test',
  prj_id: 0,
  user_id: 0
};

var createText = new Text(data);
createText.save(function(err) {
  console.log(err);
});
