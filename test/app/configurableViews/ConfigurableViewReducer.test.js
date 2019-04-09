import {
  configurableViewsActionTypes
} from 'app/configurableViews/ConfigurableViewConstants.js';
import ConfigurableViewReducer from 'app/configurableViews/ConfigurableViewReducer.js'
describe('ConfigurableViewsReducerTests', () => {
  it('Action Type: CONFIGURABLE_VIEWS_CONFIG_RECEIVED', () => {
    const data = {
      viewId: 'someViewId',
      viewName: 'Some View Name',
      viewRoute: 'some/view/route'
    };
    const action = {
      type: configurableViewsActionTypes.CONFIGURABLE_VIEWS_CONFIG_RECEIVED,
      data: data
    };
    let state = {};
    state = ConfigurableViewReducer(state, action);
    expect(state).toEqual({
      configurableViewsConfig: data
    });
  });

  it('Action Type: CUSTOM_COMPONENTS_RECEIVED', () => {
    const data = {
      componentName: 'someComponentName',
      componentData: {
        blah: 'blah',
        filler: 'filler'
      }
    };
    const action = {
      type: configurableViewsActionTypes.CUSTOM_COMPONENTS_RECEIVED,
      data: data
    };
    let state = {};
    state = ConfigurableViewReducer(state, action);
    expect(state).toEqual({
      customComponents: data
    });
  });

  it('Action Type: CUSTOM_ROUTES', () => {
    const data = 'some/custom/route';
    const action = {
      type: configurableViewsActionTypes.CUSTOM_ROUTES,
      data: data
    };
    let state = {};
    state = ConfigurableViewReducer(state, action);
    expect(state).toEqual({
      customRoutes: data
    });
  });
})
