/*
 * GET preview page.
 */
exports.view = function(req, res) {
  res.render('view', { title: "preview", get: "get" });
}
