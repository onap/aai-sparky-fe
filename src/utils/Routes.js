import {encrypt } from './Crypto.js';
import { decrypt } from '../utils/Crypto.js';


export function changeUrlAddress(pathObj, historyObj) {
  let toGo = '/' + pathObj.route;
  // left global search to act the same as before for our 2 static views for now
  // until we decide to change those 2 views too to act like extensible views.
  if (pathObj.route === 'schema' || pathObj.route === 'vnfSearch') {
    if (pathObj.filterValues && pathObj.filterValues.length > 0) {
      let filterList = [];
      for (let index in pathObj.filterValues) {
        if (pathObj.filterValues[index].filterValue !== undefined) {
          filterList.push(pathObj.filterValues[index].filterId +
            '=' +
            pathObj.filterValues[index].filterValue);
        } else {
          filterList.push(pathObj.filterValues[index].filterId + '=');
        }
      }
      toGo = toGo + '/' + filterList.toString();
    } else {
      toGo = toGo + '/' + pathObj.hashId;
    }
  } else {
    toGo += '/' + encrypt(JSON.stringify(pathObj));
  }
  historyObj.push(toGo, {lastRoute: pathObj.route});
}

export function buildRouteObjWithHash(routePath, routeHash) {
  return {
    route: routePath,
    hashId: routeHash
  };
}


export function decryptParamsForView(params) {
  let jsonParam = {};

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  let stringParams;

  try {
    stringParams = decrypt(params);
  } catch(e) {
    //add inline message in next story
    //happens when user changes the url.
  }

  if(!isJson(stringParams)) {
    return jsonParam;
  }

  jsonParam = JSON.parse(stringParams);
  return jsonParam;
}

export function buildRouteObjWithFilters(routePath, routeFiltersObj) {
  let filterValues = [];
  if (routeFiltersObj !== undefined) {
    for (let id in routeFiltersObj) {
      if (routeFiltersObj[id] !== undefined) {
        filterValues.push(
          {
            'filterId': id,
            'filterValue': routeFiltersObj[id]
          }
        );
      } else {
        filterValues.push(
          {
            'filterId': id,
            'filterValue': ''
          }
        );
      }
    }
  }

  return {
    route: routePath,
    filterValues: filterValues
  };
}
