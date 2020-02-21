/*
 * enter chat.
 */

var formidable = require('formidable');
// dir for save file
var FILE_DIR   = "/public/images";

exports.upload = function(req, res) {
  var form = new formidable.IncomingForm(),
      files = [],
      fields = [];

  form.uploadDir = FILE_DIR;

  form.on('field', function(field, value) {
    console.log(field, value);
    fields.push([field, value]);
  });

  form.on('file', function(field, file) {
    console.log(field, file);
    files.push([field, file]);
  });

  form.on('end', function() {
    console.log('-> upload done');
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received fields*\n\n '+utile.inspect(fields));
    res.write('\n\n');
    res.end('received files*\n\n'+util.inspect(files));
  });

  form.parse(req);
}
