import React from 'react';
import {
  Route
} from 'react-router-dom';
import { fetchConfigurableViewRequest } from 'app/networking/NetworkCalls';

export function getConfigurableRoutes(config, components) {
  let routes = [];
  if (config && Object.keys(config).length > 0 && components && Object.keys(components).length > 0) {
    config.layouts.forEach( (viewConfig) => {
      let ConfigurableView = components[viewConfig.viewType];
      if (ConfigurableView) {
        routes.push(
          <Route key={viewConfig.id} path={`/${viewConfig.id}`} render={ () => {
            return (
              <ConfigurableView
                config={ viewConfig }
                networkAPI={ fetchConfigurableViewRequest }/>
            );
          }}/>
        );
      }
    });
  }

  return routes;
}
