/**
 * Created by vadzim on 3/22/2016.
 */
'use strict';

var async = require('async'),
  _ = require('lodash'),
  fetcher = require('./fetcher'),
  mapFileParser = require('./mapFileParser'),
  internals = {};

internals.detectMapFileUrl = function detectMapFileUrl(scriptUrl, mapFileUrl) {
  var absUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
  if (!absUrlRegex.test(mapFileUrl)) {
    // relative url; according to sourcemaps spec is 'source origin'
    var origin,
      lastSlash = scriptUrl.lastIndexOf('/');
    if (lastSlash !== -1) {
      origin = scriptUrl.slice(0, lastSlash + 1);
      mapFileUrl = origin + mapFileUrl;
    }
  }
  var urlParts = scriptUrl.split('?');

  mapFileUrl += urlParts.length > 1 ? '?' + urlParts[1] : '';

  return mapFileUrl;
};

internals.getMapFileContent = function detectFullUrl(scriptUrl, mapFileInfo, next) {
  if (mapFileInfo.content) {
    mapFileInfo.url = scriptUrl;
    return next(null, mapFileInfo);
  }

  var mapUrl = internals.detectMapFileUrl(scriptUrl, mapFileInfo.url);
  fetcher.fetchSingle(mapUrl, function(error, mapFileDetails) {
    if (mapFileDetails) {
      mapFileDetails.url = scriptUrl;
    }
    next(error, mapFileDetails);
  });
};

exports.fetchMapFile = function fetchMapFile(scriptUrl, next) {
  async.waterfall([
    _.partial(fetcher.fetchSingle, scriptUrl),
    function(mapUrl, next) {
      if (!mapUrl.content) {
        next(Error('Content is not provided for parsing!'));
      } else {
        next(null, mapUrl.content);
      }
    },
    mapFileParser.getMapFileInfo,
    _.partial(internals.getMapFileContent, scriptUrl)
  ], next);
};