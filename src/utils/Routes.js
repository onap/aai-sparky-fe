
export function changeUrlAddress(pathObj, historyObj) {
  let toGo = '/' +
    pathObj.route +
    '/' +
    pathObj.hashId;
  historyObj.push(toGo, {lastRoute: pathObj.route});
}

export function buildRouteObj(routePath, routeHash) {
  return {
    route: routePath,
    hashId: routeHash
  };
}
