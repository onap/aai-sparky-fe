import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import {
  windowResize,
  showMainMenu,
  extensibleViewMessageCallback,
  clearExtensibleViewData,
  setSecondaryTitle
} from 'app/MainScreenWrapperActionHelper';
import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions';
import {
  globalInlineMessageBarActionTypes
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants';
import {aaiActionTypes} from 'app/MainScreenWrapperConstants';

const mockStore = configureStore([thunk]);

describe('MainScreenWrapperActionHelper', () => {
  let store;

  beforeEach(() => {
    store = mockStore({ tierSupportReducer: {} });
  });

  describe('windowResize', () => {
    it('emits action', () => {
      // Given
      const expectedActions = [{
        type: aaiActionTypes.AAI_WINDOW_RESIZE
      }];

      // When
      store.dispatch(windowResize());

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('showMainMenu', () => {
    it('emits action with payload', () => {
      // Given
      const input = "testInput";
      const expectedActions = [{
        type: aaiActionTypes.AAI_SHOW_MENU,
        data: {
          showMenu: input
        }
      }];

      // When
      store.dispatch(showMainMenu(input));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('extensibleViewMessageCallback', () => {
    const msgSeverity = "msgSeverity";

    it('emits action with payload when msgText is not blank', () => {
      // Given
      const msgText = "msgText";
      const expectedActions = [{
        type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
        data: {
          msgText: msgText,
          msgSeverity: msgSeverity
        }
      }];

      // When
      store.dispatch(extensibleViewMessageCallback(msgText, msgSeverity));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits action when msgText is blank', () => {
      // Given
      const msgText = "";
      const expectedActions = [{
        type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE

      }];

      // When
      store.dispatch(extensibleViewMessageCallback(msgText, msgSeverity));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('clearExtensibleViewData', () => {
    it('emits action with payload', () => {
      // Given
      const expectedActions = [{
        type: aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_CLEAR_DATA,
        data: {}
      }];

      // When
      store.dispatch(clearExtensibleViewData());

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('setSecondaryTitle', () => {
    it('emits action with payload', () => {
      // Given
      const title = "testTitle";
      const expectedActions = [{
        type: aaiActionTypes.SET_SECONDARY_TITLE,
        data: title
      }];

      // When
      store.dispatch(setSecondaryTitle(title));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

});
