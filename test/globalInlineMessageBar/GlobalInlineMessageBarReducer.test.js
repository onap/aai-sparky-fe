import GlobalInlineMessageBarReducer from 'app/globalInlineMessageBar/GlobalInlineMessageBarReducer.js';
import {
  globalInlineMessageBarActionTypes
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants.js';
import {
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js'

describe('GlobalInlineMessageBarReducerTests', () => {
  it('Action Type: SET_GLOBAL_MESSAGE', () => {
    const action = {
      type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
      data: {
        msgText: 'some error message here',
        msgSeverity: MESSAGE_LEVEL_WARNING
      }
    };
    let state = {};
    state = GlobalInlineMessageBarReducer(state, action);
    expect(state).toEqual({
      feedbackMsgText: action.data.msgText,
      feedbackMsgSeverity: action.data.msgSeverity
    });
  });

  it('Action Type: CLEAR_GLOBAL_MESSAGE', () => {
    const action = {
      type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE
    };
    let state = {
      feedbackMsgText: 'some error message here',
      feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
    };
    state = GlobalInlineMessageBarReducer(state, action);
    expect(state).toEqual({
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });
})
