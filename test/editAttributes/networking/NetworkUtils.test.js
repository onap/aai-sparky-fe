import createEditEntityAttributeRequestObject
  from 'editAttributes/networking/NetworkUtils';

describe('Network calls', () => {
  it('Should fetch data', () => {

    const url = "http://localhost";
    const atributes = {
      param1: "param1",
      param2: "param2",
    };

    const response = createEditEntityAttributeRequestObject(url, atributes);
    expect(response).toEqual({
      "attributes": {"param1": "param1", "param2": "param2"},
      "entity-uri": "http://localhost"
    });
  })
});
