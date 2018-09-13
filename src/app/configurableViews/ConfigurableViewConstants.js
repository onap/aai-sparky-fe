import keyMirror from 'utils/KeyMirror.js';
import {BASE_URL} from 'app/networking/NetworkConstants.js';

export const configurableViewsActionTypes = keyMirror({
  CONFIGURABLE_VIEWS_CONFIG_RECEIVED: null,
  CONFIGURABLE_VIEWS_DATA_RECEIVED: null,
  CUSTOM_ROUTES: null,
  CUSTOM_COMPONENTS_RECEIVED: null
});

export const GET_LAYOUTS_URL = BASE_URL + '/layouts';
