/**
 * Created by vadzim on 3/22/2016.
 */
'use strict';

var fs = require('fs'),
  _ = require('lodash'),
  async = require('async'),
  mapFilesFetcher = require('./mapFilesFetcher'),
  sourceMapConsumer = require('source-map'),
  fetcher = require('./fetcher'),
  STACK_FIELDS = 4,
  internals = {};

internals.detectStackRegex = function(userAgent) {
  if (internals.isFirefox(userAgent)) {
    return /@(.*):([0-9]+):([0-9]+)/;
  }
  return /^ +at.+\((.*):([0-9]+):([0-9]+)/;
};

internals.isFirefox = function(userAgent) {
  return userAgent.toLowerCase().indexOf('firefox') > -1;
};

internals.formatLine = function(source, line, column, name) {
  return "    at " + (name ? name : "(unknown)") +
    " (" + source + ":" + line + ":" + column + ")";
};

internals.processSourceMaps = function(stackInfo, mapForUri, done) {
  var result = [],
    map;

  for (var i = 0; i < stackInfo.lines.length; i++) {
    var row = stackInfo.rows[i];
    if (row) {
      var uri = row[1],
        line = parseInt(row[2], 10),
        column = parseInt(row[3], 10);
      map = mapForUri[uri];

      if (map) {
        // we think we have a map for that uri. call source-map library
        var smc = new sourceMapConsumer.SourceMapConsumer(map);
        var origPos = smc.originalPositionFor(
          {line: line, column: column});
        result.push(internals.formatLine(origPos.source, origPos.line, origPos.column, origPos.name));
      } else {
        result.push(internals.formatLine(uri, line, column, "(unknown)"));
      }
    } else {
      result.push(stackInfo.lines[i]);
    }
  }

  done(null, result);
};

exports.stackFromFile = function(browser, path, done) {
  var fileContent = fs.readFileSync(path, {encoding: 'utf8'});
  exports.mapStackTrace(browser, fileContent, done);
};

exports.mapStackTrace = function(browser, stack, done) {
  var scriptsUrls = [],
    stackInfo = {lines: [], rows: []},
    regex = internals.detectStackRegex(browser);

  stackInfo.lines = stack.split('\n');

  for (var i = 0; i < stackInfo.lines.length; i++) {
    var fields = stackInfo.lines[i].match(regex);
    if (fields && fields.length === STACK_FIELDS) {
      stackInfo.rows[i] = fields;
      scriptsUrls.push(fields[1]);
    }
  }

  var fetchMaps = _.partial(async.parallel, _.map(scriptsUrls, function(scriptUrl) {
    return _.partial(mapFilesFetcher.fetchMapFile, scriptUrl);
  }));

  async.waterfall([
    fetchMaps,
    function(results, next) {
      next(null, _.transform(results, function(mapsUri, result) {
        mapsUri[result.url] = result.content;
        return mapsUri;
      }, {}));
    },
    _.partial(internals.processSourceMaps, stackInfo)
  ], done);
};