/**
 * Created by vadzim on 3/22/2016.
 */
'use strict';

var stackAnalyzer = require('../lib/stackTraceAnalyzer'),
  _ = require('lodash');

stackAnalyzer.stackFromFile('chrome', '../stack.log', function(error, stackTrace) {
  console.log(stackTrace.join('\n'));
});