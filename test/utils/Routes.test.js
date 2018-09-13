import {
  buildRouteObjWithHash,
  decryptParamsForView,
  buildRouteObjWithFilters,
  changeUrlAddress
} from 'utils/Routes.js';
import {
  encrypt
} from 'utils/Crypto.js';

describe('Routes', () => {
  it('build route with hash', () => {
    const expectedResult = {
      route: '/vnfSearch',
      hashId: 'someCrazyHashHere'
    };

    const result = buildRouteObjWithHash(expectedResult.route, expectedResult.hashId);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult));
  });

  it('decrypt params for view', () => {
    const stringToEncrypt = 'someCrazyStringHere';
    const encryptedString = encrypt(stringToEncrypt);
    const result = decryptParamsForView(encryptedString);

    expect(JSON.stringify(result)).toBe(JSON.stringify({}));
  });

  it('decrypt params for view with obj', () => {
    const objToEncrypt = [{id: 'someCrazyParamHere'}, {id: 'anotherCrazyParam'}];
    const encryptedObj = encrypt(JSON.stringify(objToEncrypt));
    const result = decryptParamsForView(encryptedObj);

    expect(JSON.stringify(result)).toBe(JSON.stringify(objToEncrypt));
  });

  it('build routes with filters', () => {
    const objToEncrypt = [{id: 'someCrazyParamHere'}, {id: 'anotherCrazyParam'}];
    const encryptedObj = encrypt(JSON.stringify(objToEncrypt));
    const result = decryptParamsForView(encryptedObj);

    expect(JSON.stringify(result)).toBe(JSON.stringify(objToEncrypt));
    const filterObj = {
      filter1: 'value1',
      filter2: undefined,
      filter3: 'anotherValue'
    };
    const routePath = '/vnfSearch';
    const expectedResults = {
      route: routePath,
      filterValues: [
        {
          filterId: 'filter1',
          filterValue: 'value1'
        },
        {
          filterId: 'filter2',
          filterValue: ''
        },
        {
          filterId: 'filter3',
          filterValue: 'anotherValue'
        }
      ]
    }

    const routeWithFilters = buildRouteObjWithFilters(routePath, filterObj);

    expect(JSON.stringify(routeWithFilters)).toBe(JSON.stringify(expectedResults));
  });

  it('change URL address for well known paths', () => {
    const pathObj = {
      route: 'schema',
      filterValues: [
        {
          filterId: 'filter1',
          filterValue: 'value1'
        },
        {
          filterId: 'filter2',
          filterValue: undefined
        },
        {
          filterId: 'filter3',
          filterValue: 'anotherValue'
        }
      ]
    };
    let historyObj = [];
    const filterList = [
      'filter1=value1',
      'filter2=',
      'filter3=anotherValue'
    ];
    const toGo = '/' + pathObj.route + '/' + filterList.toString();
    const expectedResult = [
      toGo,
      {
        lastRoute: pathObj.route
      }
    ];

    changeUrlAddress(pathObj, historyObj);

    expect(JSON.stringify(historyObj)).toBe(JSON.stringify(expectedResult));
  });

  it('change URL address for well known paths with hash id', () => {
    const pathObj = {
      route: 'schema',
      hashId: 'someCrazyHashIdHere'
    };
    let historyObj = [];
    const toGo = '/' + pathObj.route + '/' + pathObj.hashId;
    const expectedResult = [
      toGo,
      {
        lastRoute: pathObj.route
      }
    ];

    changeUrlAddress(pathObj, historyObj);

    expect(JSON.stringify(historyObj)).toBe(JSON.stringify(expectedResult));
  });
})
