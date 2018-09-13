import {
  configurableViewsActionTypes
} from './ConfigurableViewConstants.js';

export default (state = {}, action) => {
  let data = action.data;
  switch (action.type) {
    case configurableViewsActionTypes.CONFIGURABLE_VIEWS_CONFIG_RECEIVED:
      return {
        ...state,
        configurableViewsConfig: data
      };
    case configurableViewsActionTypes.CUSTOM_COMPONENTS_RECEIVED:
      return {
        ...state,
        customComponents: data
      };
    case configurableViewsActionTypes.CUSTOM_ROUTES:
      return {
        ...state,
        customRoutes: data
      };
  }

  return state;
};
