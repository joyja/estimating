#!/usr/bin/env node
require('make-promises-safe')
const { start } = require('./server')
start('estimating')
