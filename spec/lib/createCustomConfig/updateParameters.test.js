const { BUILD_PARAMETER_KEY }
  = require( '../../../lib/createCustomConfig/constants.json' );

describe( 'The updateParametersFunction', ()=>{

  it( 'should combine the values past in with build config parameters found in the env', ()=>{

    const expectedKey
      = 'SomeKey';

    const expected
      = 'SomeValue';

    const updateParameters = getUpdateParametersFunction( {
      [ `${ BUILD_PARAMETER_KEY }${ expectedKey }` ]: expected
    } );

    const actual
      = updateParameters( {} );

    expect( actual[ expectedKey ] )
      .to.equal( expected );

  } );

  it( 'should override values found in the config object provided', ()=>{

    const expectedKey
      = 'SomeKey';

    const expected
      = 'SomeValue';

    const updateParameters = getUpdateParametersFunction( {
      [ `${ BUILD_PARAMETER_KEY }${ expectedKey }` ]: expected
    } );

    const targetConfig = {
      [ expectedKey ]: 'somethingElse'
    };

    const actual
      = updateParameters( targetConfig );

    expect( actual[ expectedKey ] )
      .to.equal( expected );

  } );

  it( 'should not depend on inputs being mutable', ()=>{

    const expectedKey
      = 'SomeKey';

    const expected
      = 'SomeValue';

    const config
      = Object.freeze( {} );

    const updateParameters = getUpdateParametersFunction( {
      [ `${ BUILD_PARAMETER_KEY }${ expectedKey }` ]: expected
    } );

    const actual
      = updateParameters( config );

    expect( actual[ expectedKey ] )
      .to.equal( expected );

  } );

  it( 'should override values found at an object path in the config object provided', ()=>{

    const someParentKey
      = 'SomeParentKey';

    const someChildKey
      = 'SomeChild';

    const expectedKey
      = `${ someParentKey }__${ someChildKey }`;

    const expected
      = 'SomeValue';

    const updateParameters = getUpdateParametersFunction( {
      [ `${ BUILD_PARAMETER_KEY }${ expectedKey }` ]: expected
    } );

    const targetConfig = {
      [ someParentKey ]: {
        [ someChildKey ]: 'somethingElse'
      }
    };

    const actual
      = updateParameters( targetConfig );

    expect( actual[ someParentKey ][ someChildKey ] )
      .to.equal( expected );

  } );

  it( 'should override values found at an array path in the config object provided', ()=>{

    const someKey
      = 'SomeKey';

    const expectedKey
      = `${ someKey }___0`;

    const expected
      = 'SomeValue';

    const updateParameters = getUpdateParametersFunction( {
      [ `${ BUILD_PARAMETER_KEY }${ expectedKey }` ]: expected
    } );

    const targetConfig = {
      [ someKey ]: [
        'somethingElse'
      ]
    };

    const actual
      = updateParameters( targetConfig );

    expect( actual[ someKey ][ 0 ] )
      .to.equal( expected );

  } );


  // helpers

  function getUpdateParametersFunction( env ){

    return proxyquire( '../../lib/createCustomConfig/updateParameters', { './env': env } );

  }

} );

