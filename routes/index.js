/*
 * GET home page.
 */
var ua = require('user-agent');

exports.index = function(req, res){
  var ua_obj = ua.parse(req.headers['user-agent']);
  var ad_exp = new RegExp('android', 'i');
  var ip_exp = new RegExp('iphone', 'i');
  is_android = ad_exp.test(ua_obj.full);
  is_iphone  = ip_exp.test(ua_obj.full);
  var dt_obj = new Date();
  var date   = dt_obj.toString().split(' ');
  date       = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];

  res.render('index', { title: 'Wedding party for', tt: 'Takehiko & Chieko',  sub: date, mobile: {android: is_android, iphone: is_iphone} });
};
