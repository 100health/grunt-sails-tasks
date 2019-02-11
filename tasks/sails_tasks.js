/*
 * grunt-sails-tasks
 * https://github.com/tobalsgithub/grunt-sails-tasks
 *
 * Copyright (c) 2015 TC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('sails_tasks', 'A grunt command to run 1 off tasks with sails', function() {
    var sails = require('sails');
    var asyncFn;
    var fns = this.data.functions;
    var done = this.async();
    var series = this.data.series;

    if (!fns || !fns.length) {
      return grunt.fail.fatal('Missing required field "functions"');
    }

    if (!(fns instanceof Array)) {
      fns = [fns];
    }

    var liftSails = function (config, cb) {
      if (sails.config) {
        return cb();
      }

      sails.lift(config, cb);
    };

    liftSails({
      port: process.env.REDOXLOCAL_GRUNT_PORT || 1337,
      environment: grunt.option('env') || process.env.NODE_ENV,
      tasks: true
    }, function (err, sails) {

      if (err) {
        grunt.fail.fatal('Could not lift sails: ' + err);
        return done();
      }

      if (series) {
        asyncFn = async.series;
      } else {
        asyncFn = async.parallel;
      }

      asyncFn(fns, function (err) {
        if (err) {
          grunt.fail.fatal('An error occurred running the input functions ' + err);
        }

        return done();
      });

    });
  });
};
