// set common globals expect for tests so we need not require them in test files
const mockfs = require( 'mock-fs' );

/**
 * Creates a mockfs instance with the arguments provided, but also enforces
 * mockfs.restore after each test suite call. Must be called inside a
 * <em>describe</em> block;
 *
 * @see https://github.com/tschaub/mock-fs
 *
 * @param {any} args
 *  mockfs arguments
 * @returns {obj}
 *  the mockfs instance
 */
function createMockFs( ...args ){

  afterEach( ()=>mockfs.restore() );
  return mockfs( ...args );

}

global.mockfs
  = createMockFs;

const chai
  = require( 'chai' );

const sinonChai
  = require( 'sinon-chai' );

chai.use( sinonChai );

global.expect
  = chai.expect;

global.proxyquire
  = require( 'proxyquire' ).noCallThru();

global.sinon
  = require( 'sinon' );
