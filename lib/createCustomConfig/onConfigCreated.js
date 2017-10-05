/* eslint-disable no-console */
const env = require( './env' );

const { VENZEE_CUSTOM_BUILD_TARGET, VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH }
  = env;

/**
 * Prints createConfig results to the console. Ignored by Code coverage
 * 
 * @param {any} err - Error if thrown 
 * @returns {void} 
 */
function onConfigCreated( err ){
  
  if( err ) return console.error( String( err ) ); 
  if( VENZEE_CUSTOM_BUILD_TARGET ){
        
    console.info(
      `Created custom config '${ VENZEE_CUSTOM_BUILD_TARGET }' based on '${ VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH }'`
    );
    
  }

}

module.exports = onConfigCreated;
