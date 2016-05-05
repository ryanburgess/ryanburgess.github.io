'use strict';
const mkdirp = require('mkdirp');
const write = require('./lib/write');

// Content

// Templates
const main = require('./templates/main');

// update index.html
write('index.html', main('home'));

