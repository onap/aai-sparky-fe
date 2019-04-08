import {
  configurableViewsActionTypes
} from 'app/configurableViews/ConfigurableViewConstants.js';
import ConfigurableViewReducer from 'app/configurableViews/ConfigurableViewReducer.js'
describe('ConfigurableViewsReducerTests', () => {
  it('Action Type: CONFIGURABLE_VIEWS_CONFIG_RECEIVED', () => {
    // Given
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

    // When
    state = ConfigurableViewReducer(state, action);

    // Then
    expect(state).toEqual({
      configurableViewsConfig: data
    });
  });

  it('Action Type: CUSTOM_COMPONENTS_RECEIVED', () => {
    // Given
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

    // When
    state = ConfigurableViewReducer(state, action);

    // Then
    expect(state).toEqual({
      customComponents: data
    });
  });

  it('Action Type: CUSTOM_ROUTES', () => {
    // Given
    const data = 'some/custom/route';
    const action = {
      type: configurableViewsActionTypes.CUSTOM_ROUTES,
      data: data
    };
    let state = {};

    // When
    state = ConfigurableViewReducer(state, action);

    // Then
    expect(state).toEqual({
      customRoutes: data
    });
  });

  it('Action Type: unknown', () => {
    // Given
    const action = {
      type: "TestUnknownType",
      data: "TestData"
    };
    let state = {};

    // When
    state = ConfigurableViewReducer(state, action);

    // Then
    expect(state).toEqual(state);
  });
});
