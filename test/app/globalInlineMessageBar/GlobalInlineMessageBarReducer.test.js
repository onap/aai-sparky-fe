import GlobalInlineMessageBarReducer from 'app/globalInlineMessageBar/GlobalInlineMessageBarReducer';
import {
  globalInlineMessageBarActionTypes
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants';
import {
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants'

describe('GlobalInlineMessageBarReducerTests', () => {
  it('Action Type: SET_GLOBAL_MESSAGE', () => {
    // Given
    const action = {
      type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
      data: {
        msgText: 'some error message here',
        msgSeverity: MESSAGE_LEVEL_WARNING
      }
    };
    let state = {};

    // When
    state = GlobalInlineMessageBarReducer(state, action);

    // Then
    expect(state).toEqual({
      feedbackMsgText: action.data.msgText,
      feedbackMsgSeverity: action.data.msgSeverity
    });
  });

  it('Action Type: CLEAR_GLOBAL_MESSAGE', () => {
    // Given
    const action = {
      type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE
    };
    let state = {
      feedbackMsgText: 'some error message here',
      feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
    };

    // When
    state = GlobalInlineMessageBarReducer(state, action);

    // Then
    expect(state).toEqual({
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });

  it('Action Type: unknown', () => {
    // Given
    const action = {
      type: "TestUnknownType"
    };
    const initialState = {
      feedbackMsgText: 'some error message here',
      feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
    };

    // When
    const newState = GlobalInlineMessageBarReducer(initialState, action);

    // Then
    expect(newState).toEqual(initialState);
  });
});
