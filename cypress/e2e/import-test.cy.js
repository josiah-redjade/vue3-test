import { returnfoo } from '../../src/components/logfoo';


describe('Successfully imports a function and runs it', () => {
  context('logging', () => {
    it('should log foo', () => {
      expect(returnfoo('foo')).to.eq('foo')
    });
  })
})
  // -- End: Our Cypress Tests --
