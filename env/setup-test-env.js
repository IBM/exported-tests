require('ts-node').register({ /* options */ })
require('@babel/register')();
require('jsdom-global')();

process.env.logWarnings = true;
