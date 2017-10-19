const set
  = require( 'lodash/set' );

const { BUILD_PARAMETER_KEY }
  = require( './constants.json' );

const env
  = require( './env' );

function updateParameters( config ){

  const customConfig
    = Object.assign( {}, config );

  return Object
    .keys( env )
    .filter( key=>key.startsWith( BUILD_PARAMETER_KEY ) )
    .reduce( ( acc, key )=>set( acc, key.replace( BUILD_PARAMETER_KEY, '' ), env[ key ] ), customConfig );

}

module.exports = updateParameters;

