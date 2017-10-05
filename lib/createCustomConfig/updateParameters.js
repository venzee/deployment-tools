const { BUILD_PARAMETER_KEY }
  = require( './constants.json' );

const env
  = require( './env' );

function updateParameters( config ){

  const customBuildParameters = Object
    .keys( env )
    .filter( key=>key.startsWith( BUILD_PARAMETER_KEY ) )
    .reduce( ( acc, key )=>Object.assign( acc, { [ key.replace( BUILD_PARAMETER_KEY, '' ) ]: env[ key ] } ), {} );

  return Object.assign( {}, config, customBuildParameters );  

}

module.exports = updateParameters;
