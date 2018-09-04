'use strict';

var madge = require('madge');
var sha1 = require('sha-1');

function Dependo(targetPath, options) {
  this.config = options || {};

  this.targetPath = targetPath;

  this.basePath = options.basePath;
  this.config.format = String(options.format || 'es6').toLowerCase();
  this.config.exclude = options.exclude || null;
  this.config.fileExtensions = ['ts'];
  this.identification =
    sha1(targetPath + JSON.stringify(this.config)) ||
    ~~(Math.random() * 999999999);
  this.title = options.title || 'dependo';
}

Dependo.prototype.generateHtml = function() {
  if (this.config.format === 'json') {
    this.dependencies = this.config.directDeps;
  } else {
    madge(this.targetPath, this.config).then(res => {
      const html = require('./html').output(
        this.basePath,
        res.tree,
        this.identification,
        this.title
      );

      process.stdout.write(html);
    });
  }

  //   if (this.config.transform && typeof this.config.transform == 'function') {
  //     this.dependencies = this.config.transform(this.dependencies);
  //   }
};

module.exports = Dependo;
