#!/usr/bin/env node
const fs
  = require( 'fs-extra' );

const env
  = require( './env' );

const updateParameters
  = require( './updateParameters' );

const just
  = require( 'object-streaming-tools/lib/just' );

const apply
  = require( 'object-streaming-tools/lib/apply' );

const asyncify
  = require( 'async/asyncify' );

const { VENZEE_CUSTOM_BUILD_TARGET, VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH }
  = env;

function createCustomConfig( next ){

  if( !VENZEE_CUSTOM_BUILD_TARGET ) return setImmediate( next ); // nothing to do

  just( VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH )
    .pipe( apply( fs.loadJson.bind( fs ) ) )
    .on( 'error', next )
    .pipe( apply( asyncify( updateParameters ) ) )
    .on( 'error', next )
    .pipe( apply( fs.writeJson.bind( fs, VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH ) ) )
    .on( 'error', next )
    .on( 'finish', next )
    .resume();

}

module.exports = createCustomConfig;

/* istanbul ignore if */
if( require.main === module ) createCustomConfig( require( './onConfigCreated' ) );
/* istanbul ignore else */
