import NetworkCalls from 'editAttributes/networking/NetworkCalls';
import * as sinon from 'sinon';

describe('#Network calls', () => {

  let suite;

  beforeEach(() => {
    suite = {};
    suite.sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    suite.sandbox.reset();
  });

  describe('#fetchConfigurableViewRequest', () => {
    it('Should fetch data with param', () => {

      const fetchPromise = Promise.resolve();
      global.fetch = suite.sandbox.stub();

      global.fetch
      .withArgs('URL', {
        credentials: 'CREDENTIALS',
        method: 'METHOD',
        headers: 'HEADER',
        body: 'BODY'
      })
      .returns(fetchPromise);

      NetworkCalls.fetchRequest('URL', 'CREDENTIALS', 'METHOD', 'HEADER',
        'BODY');

      sinon.assert.calledWith(fetch, 'URL', {
        credentials: 'CREDENTIALS',
        method: 'METHOD',
        headers: 'HEADER',
        body: 'BODY'
      });
    });
  });

  describe('#fetchJSON', () => {
    it('Should return json data', () => {
      global.fetch = suite.sandbox.stub();
      const then = suite.sandbox.stub();
      fetch.returns({then});

      NetworkCalls.fetchRequest('URL', 'CREDENTIALS', 'METHOD', 'HEADER',
        'BODY');
      const response = then.firstCall.args[0];

      expect(response({json: () => 'json'})).toEqual('json');
      sinon.assert.calledOnce(fetch);
    });
  });
});
