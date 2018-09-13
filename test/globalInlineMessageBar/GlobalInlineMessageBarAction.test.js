import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';
import {
  globalInlineMessageBarActionTypes
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants.js';
import {
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js'

describe('GlobalInlineMessageBarActionTests', () => {
  it('getSetGlobalMessageEvent', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    const msgText = 'some test msg';
    store.dispatch(getSetGlobalMessageEvent(msgText, MESSAGE_LEVEL_WARNING));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
      data: {
        msgText: msgText,
        msgSeverity: MESSAGE_LEVEL_WARNING
      }
    }]);
  });

  it('getClearGlobalMessageEvent', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({});
    store.dispatch(getClearGlobalMessageEvent());
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE
    }]);
  });
})
