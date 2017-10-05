const assert
  = require( 'assert' );

describe( 'The createCustomConfig function', ()=>{

  it( 'should do nothing if VENZEE_CUSTOM_BUILD_TARGET is not set', done=>{

    const emptyEnv
      = {};

    const createCustomConfig
      = getUITFunction( emptyEnv, {} );
      
    createCustomConfig( err=>{

      // we got here without error, even though fsExtra is not defined, so
      // we did nothing
      expect( err )
        .not.to.be.ok;

      done();

    } );
      
  } );

  const VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH 
    = 'client/app/config/config.rsqa.json';

  it( 'should read the file at the VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH', done=>{

    const fsExtra = {
      loadJson:  sinon.spy( createMockLoad( {} ) ),
      writeJson: noop
    };

    const env = {
      VENZEE_CUSTOM_BUILD_TARGET: 'SomeTargetName',
      VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH
    };

    const createCustomConfig
      = getUITFunction( env, fsExtra );

    createCustomConfig( err=>{

      expect( err )
        .not.to.be.ok;

      expect( fsExtra.loadJson )
        .to.have.been.calledWith( VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH );

      done();
      
    } );

  } );

  it( 'should overwrite the file at the VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH', done=>{

    const fsExtra = {
      loadJson:  createMockLoad( {} ),
      writeJson: sinon.spy( noop )
    };

    const env = {
      VENZEE_CUSTOM_BUILD_TARGET: 'SomeTargetName',
      VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH
    };

    const createCustomConfig
      = getUITFunction( env, fsExtra );

    createCustomConfig( err=>{

      expect( err )
        .not.to.be.ok;

      expect( fsExtra.writeJson )
        .to.have.been.calledWith( VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH );

      done();
      
    } );

  } );

  it( 'should overwrite the new configuration with updated parameters', done=>{

    const expected
      = { someKey: 'someValue' };

    function updateParameters(){

      return expected;

    }

    const fsExtra = {
      loadJson:  createMockLoad( {} ),
      writeJson: sinon.spy( noop )
    };

    const env = {
      VENZEE_CUSTOM_BUILD_TARGET: 'SomeTargetName',
      VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH
    };
  
    const createCustomConfig
      = getUITFunction( env, fsExtra, updateParameters );

    createCustomConfig( err=>{

      expect( err )
        .not.to.be.ok;

      expect( fsExtra.writeJson )
        .to.have.been.calledWith( VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH, expected );

      done();
      
    } );

  } );

  // helpers

  function getUITFunction( env, fsExtra, updateParameters ){
 
    return proxyquire( '../../lib/createCustomConfig/index', Object.assign( {
      'fs-extra': fsExtra,
      './env':    env }, updateParameters ? { './updateParameters': updateParameters } : {}
    ) );
    
  }

  function noop( ...args ){
    
    setImmediate( args[ args.length - 1 ] );

  }

  function createMockLoad( config ){

    return function mockLoad( path, onLoaded ){

      assert( path == VENZEE_CUSTOM_BUILD_BASE_CONFIG_PATH );    
      setImmediate( onLoaded, null, config );

    };

  }

} );
