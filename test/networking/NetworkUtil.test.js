import {getTSUIElasticSearchQueryString} from 'app/networking/NetworkUtil';

describe("Network Utils", () => {
  describe('#getTSUIElasticSearchQueryString', () => {
    it('should return query body', () => {
      const query = "query";
      const response = getTSUIElasticSearchQueryString(query);
      expect(response).toEqual({"maxResults": "10", "queryStr": "query"});
    });

    it('should return partial request query', () => {
      const query = "";
      const response = getTSUIElasticSearchQueryString(query);
      expect(response).toEqual({"maxResults": "10", "queryStr": ""});
    });

    it('should be truthy', () => {
      const query = "";
      expect(getTSUIElasticSearchQueryString(query)).toBeTruthy();
    })
  });
});
