import NetworkCalls from 'app/networking/NetworkCalls';
import * as sinon from "sinon";

describe("Network Utils", () => {

  let suite;

  beforeEach(() => {
    suite = {};
    suite.sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    suite.sandbox.reset();
  });

  describe('#fetchRequest', () => {
    it('should fetch request', () => {
      global.fetch = suite.sandbox.stub();

      const then = suite.sandbox.stub();

      fetch.returns({then});

      NetworkCalls.fetchRequest("URL", "POST", "POST", "HEADER", "BODY");
      sinon.assert.calledOnce(then);

      expect(then.firstCall.args[0]({json: () => "json"})).toEqual("json");
      sinon.assert.calledOnce(fetch);
    });
  });

  describe('#fetchConfigurableViewRequest', () => {
    it('fetch configurable request', () => {
      const queryData = {
        api: "api",
        method: "method",
        headers: "headers",
        componentDataDescriptor: {object: "object"}
      };

      const fetchPromise = Promise.resolve();
      global.fetch = suite.sandbox.stub();

      global.fetch
      .withArgs(queryData.api, {
        method: queryData.method,
        headers: queryData.headers,
        body: queryData.body
      })
      .returns(fetchPromise);

      NetworkCalls.fetchConfigurableViewRequest(queryData);

      sinon.assert.calledWith(fetch, "http://localhost:api", {
        method: queryData.method,
        headers: queryData.headers,
        credentials: "same-origin",
        body: '{"object":"object"}'
      });
    });
  });

  describe('#fetchRequestObj', () => {
    it('fetch request object', () => {

      const fetchPromise = Promise.resolve();
      global.fetch = suite.sandbox.stub();
      const url = 'url';

      global.fetch
      .withArgs(url, {
        method: 'GET',
        headers: 'POST_HEADER',
        body: 'BODY'

      })
      .returns(fetchPromise);

      NetworkCalls.fetchRequestObj(url, "GET", "POST_HEADER", "BODY");

      sinon.assert.calledWith(fetch, url, {
        credentials: 'same-origin',
        method: "GET",
        headers: "POST_HEADER",
        body: "BODY"
      });
    });
  });

  describe('#getRequest', () => {
    it("should fetch any request", () => {
        // given
        global.fetch = suite.sandbox.stub();
        const json = suite.sandbox.stub();
        const url = "localhost";

        global.fetch
            .withArgs(url, {
                credentials: 'same-origin',
                method: 'GET'
            })
            .returns(json);

        // when
        const request = NetworkCalls.getRequest(url, "GET");

        //then
        expect(request).toBe(json)
        sinon.assert.calledOnce(global.fetch);
    });
  });

  describe('#genericRequest', () => {
    it('should fetch any generic request', () => {
      // given
      global.fetch = suite.sandbox.stub();
      const then = suite.sandbox.stub();
      fetch.returns({then});

      // when
      NetworkCalls.genericRequest("localhost", "/relativeUrl", "GET");

      // then
      expect(then.firstCall.args[0]({json: () => "d"})).toEqual("d");
      sinon.assert.calledOnce(fetch);
    });

    it('should fetch any generic request - non relative', () => {
      // given
      global.fetch = suite.sandbox.stub();
      const then = suite.sandbox.stub();
      fetch.returns({then});

      // when
      NetworkCalls.genericRequest("localhost", false, "GET");

      // then
      expect(then.firstCall.args[0]({json: () => "d"})).toEqual("d");
      sinon.assert.calledOnce(fetch);
    });
  });
});
