/**
 * Created by vadzim on 3/22/2016.
 */
'use strict';
var _ = require('lodash');

exports.getMapFileInfo = function(content, next) {
  var match = content.match("//# sourceMappingURL=(.*)[\\s]*$", "m"),
    result = {};
  if (match && match.length === 2) {
    var mapUri = match[1],
      embeddedSourceMap = mapUri.match("data:application/json;base64,(.*)");
    if (embeddedSourceMap && embeddedSourceMap[1]) {
      result.content = new Buffer(embeddedSourceMap[1], 'base64').toString('utf8');
    } else {
      result.url = mapUri;
    }
  }
  next(null, result);
};