import {
  GET,
  POST_HEADER
} from 'app/networking/NetworkConstants.js';
import {
  GET_LAYOUTS_URL,
  configurableViewsActionTypes
} from './ConfigurableViewConstants.js';

function createConfigReceivedEvent(config) {
  return {
    type: configurableViewsActionTypes.CONFIGURABLE_VIEWS_CONFIG_RECEIVED,
    data: config
  };
}

export function newCustomComponentsEvent(components) {
  return {
    type: configurableViewsActionTypes.CUSTOM_COMPONENTS_RECEIVED,
    data: components
  };
}

export function setCustomRoutes(routes) {
  return {
    type: configurableViewsActionTypes.CUSTOM_ROUTES,
    data: routes
  };
}

export function getConfigurableViewConfigs() {
  return dispatch => {
    return fetch(GET_LAYOUTS_URL, {
      method: GET,
      headers: POST_HEADER
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => {
        dispatch(createConfigReceivedEvent(responseJson));
      }
    ).catch(
      (err) => {
        console.log(`problems fetching configurable view configs: ${err}`);
      }
    );
  };
}
