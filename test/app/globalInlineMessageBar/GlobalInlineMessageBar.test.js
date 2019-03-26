import React from 'react';
import { mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';

import GlobalInlineMessageBar from 'app/globalInlineMessageBar/GlobalInlineMessageBar.jsx'
import {
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js'
import InlineMessage from 'generic-components/InlineMessage/InlineMessage.jsx';

describe('GlobalInlineMessageBarTests', () => {
  const errMsg = 'some random message';
  const initialState = {
    globalInlineMessageBar: {
      feedbackMsgText: errMsg,
      feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
    }
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><GlobalInlineMessageBar /></Provider>);
  })

  it('render message bar - visible', () => {
    expect(wrapper).toHaveLength(1); // ensure the message bar is mounted
    expect(wrapper.find(InlineMessage)).toHaveLength(1); // ensure the InlineMessage is mounted
  });

  it('props assigned properly', () => {
    expect(wrapper.find(InlineMessage).props().level).toEqual(MESSAGE_LEVEL_WARNING); // check that the props match
    expect(wrapper.find(InlineMessage).props().messageTxt).toEqual(errMsg); // check that the props match
  })
})
