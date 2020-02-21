/*
 * enter chat.
 */

exports.enter = function(req, res) {
  var result = {
    title: 'お祝いの言葉を贈ろう',
    sub: 'for takehiko and chieko',
    username: req.body.username
  };
  res.render('room', result);
}
