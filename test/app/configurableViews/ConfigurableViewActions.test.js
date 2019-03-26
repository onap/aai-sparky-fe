import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock';
import {
  configurableViewsActionTypes
} from 'app/configurableViews/ConfigurableViewConstants.js';
import {
  newCustomComponentsEvent,
  setCustomRoutes,
  getConfigurableViewConfigs
} from 'app/configurableViews/ConfigurableViewActions.js'


describe('ConfigurableViewActionTests', () => {
  const sampleConfig = {
    "id": "aggregateReport",
    "title": "Aggregate Report",
    "iconURL": "resources/images/sampleAggReportIcon.svg",
    "iconHoverURL": "resources/images/sampleAggReportIconHover.svg",
    "viewType": "ConfigurableCardView",
    "layout": {
      "draggable": true,
      "resizable": true,
      "rowHeight": 100,
      "cardMargin": [
        20,
        20
      ],
      "cardPadding": [
        20,
        20
      ],
      "breakpoints": [
        {
          "id": "lg",
          "col": 12,
          "width": 1400
        },
        {
          "id": "md",
          "col": 8,
          "width": 1200
        },
        {
          "id": "sm",
          "col": 6,
          "width": 1024
        }
      ]
    },
    "components": [
      {
        "id": "visualization1",
        "title": "Total VNFs",
        "queryData": {
          "eventId": "visualization1",
          "api": "/get-component-data",
          "method": "POST",
          "headers": {
            "accept": "application/json"
          },
          "componentDataDescriptor": {
            "index": "aggregate_generic-vnf_index",
            "queryType": "aggregation",
            "query": {
              "filter": {},
              "queries": [],
              "aggregations": [
                {
                  "name": "prov-status",
                  "aggregation": {
                    "group-by": {
                      "field": "prov-status",
                      "size": 0
                    }
                  }
                },
                {
                  "name": "orchestration-status",
                  "aggregation": {
                    "group-by": {
                      "field": "orchestration-status",
                      "size": 0
                    }
                  }
                },
                {
                  "name": "nf-type",
                  "aggregation": {
                    "group-by": {
                      "field": "nf-type",
                      "size": 0
                    }
                  }
                },
                {
                  "name": "nf-role",
                  "aggregation": {
                    "group-by": {
                      "field": "nf-role",
                      "size": 0
                    }
                  }
                }
              ]
            },
            "responseTransformation": {
              "type": "count",
              "spec": {
                "countType": "total",
                "countResponseLabel": "display"
              }
            }
          }
        },
        "containerData": {
          "containerType": "NetworkQueryCard",
          "visualizationType": "text",
          "visualizationProp": {
            "display": "",
            "style": {
              "textAlign": "center",
              "fontSize": "50px",
              "fontWeight": "bold",
              "paddingTop": "50px"
            }
          },
          "breakpoints": {
            "lg": {
              "w": 2,
              "h": 2,
              "x": 0,
              "y": 0
            },
            "md": {
              "w": 2,
              "h": 2,
              "x": 0,
              "y": 0
            },
            "sm": {
              "w": 6,
              "h": 2,
              "x": 0,
              "y": 0
            }
          }
        }
      }
    ]
  };

  it('newCustomComponentsEvent', () => {
    const components = [
      {
        compId: 'someId',
        compName: 'Some Name'
      }
    ];
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    store.dispatch(newCustomComponentsEvent(components));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: configurableViewsActionTypes.CUSTOM_COMPONENTS_RECEIVED,
      data: components
    }]);
  });

  it('setCustomRoutes', () => {
    const routes = [
      {
        routeName: 'Some Custom Route',
        path: 'some/route/path'
      }
    ];
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    store.dispatch(setCustomRoutes(routes));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: configurableViewsActionTypes.CUSTOM_ROUTES,
      data: routes
    }]);
  });

  it('getConfigurableViewConfigs', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    const expectedActions = [
      {
        type: configurableViewsActionTypes.CONFIGURABLE_VIEWS_CONFIG_RECEIVED,
        data: sampleConfig
      }
    ];
    fetchMock.mock('*', sampleConfig);

    return store.dispatch(getConfigurableViewConfigs())
      .then( () => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
        fetchMock.restore();
      });
  });
})
