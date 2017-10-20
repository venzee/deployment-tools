const set
  = require( 'lodash/set' );

const { BUILD_PARAMETER_KEY }
  = require( './constants.json' );

const env
  = require( './env' );

const PATH_KEY
  = '__';

const SUB_KEY
  = '___';

function updateParameters( config ){

  const customConfig
    = Object.assign( {}, config );

  return Object
    .keys( env )
    .filter( key=>key.startsWith( BUILD_PARAMETER_KEY ) )
    .map( key=>( { key, path: extractPath( key ) } ) )
    .reduce( ( acc, { key, path } )=>set( acc, path, env[ key ] ), customConfig );

}

module.exports = updateParameters;

function extractPath( key ){

  const path
    = key.replace( BUILD_PARAMETER_KEY, '' );

  if( path.includes( SUB_KEY ) ) return path.split( SUB_KEY ).reduce( ( acc, sub )=>`${ acc }[${ sub }]` );
  if( path.includes( PATH_KEY ) ) return path.replace( PATH_KEY, '.' );

  return path;

}


