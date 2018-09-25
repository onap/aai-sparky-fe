import NotificationReducer from 'generic-components/notifications/NotificationReducer';
import NotificationConstants from "generic-components/notifications/NotificationConstants";


describe('NotificationReducer', () => {
    const defaultState = {
        type: 'default',
        title: 'some default title',
        msg: 'some default message',
        timeout: 1
    };

    it('Should return default state when action type is not supported', () => {
        // given
        const unsupportedAction = {
            type: undefined
        };

        // when
        const actualState = NotificationReducer(defaultState, unsupportedAction);

        // then
        expect(actualState).toEqual(defaultState);
    });

    it('Should return state with type default when action type is info', () => {
        // given
        const expectedState = {
            type: 'default',
            title: 'some title',
            msg: 'some message',
            timeout: 5
        };

        const infoAction =  {
            type: NotificationConstants.NOTIFY_INFO,
            data: {
                title: "some title",
                msg: "some message",
                timeout: 5
            }
        };

        // when
        const actualState = NotificationReducer(defaultState, infoAction);

        // then
        expect(actualState).toEqual(expectedState);
    });


    it('Should return status with type success when action type is success', () => {
        // given
        const expectedState = {
            type: 'success',
            title: 'some title',
            msg: 'some message',
            timeout: 2
        };

        const infoAction =  {
            type: NotificationConstants.NOTIFY_SUCCESS,
            data: {
                title: "some title",
                msg: "some message",
                timeout: 2
            }
        };

        // when
        const actualState = NotificationReducer(defaultState, infoAction);

        // then
        expect(actualState).toEqual(expectedState);
    });

    it('Should return status with type success when action type is success', () => {
        // given
        const expectedState = {
            type: 'success',
            title: 'some title',
            msg: 'some message',
            timeout: 2
        };

        const infoAction =  {
            type: NotificationConstants.NOTIFY_SUCCESS,
            data: {
                title: "some title",
                msg: "some message",
                timeout: 2
            }
        };

        // when
        const actualState = NotificationReducer(defaultState, infoAction);

        // then
        expect(actualState).toEqual(expectedState);
    });

    it('Should return status with type error when action type is error', () => {
        // given
        const expectedState = {
            type: 'error',
            title: 'some title',
            msg: 'some message',
            timeout: 2
        };

        const infoAction =  {
            type: NotificationConstants.NOTIFY_ERROR,
            data: {
                title: "some title",
                msg: "some message",
                timeout: 2
            }
        };

        // when
        const actualState = NotificationReducer(defaultState, infoAction);

        // then
        expect(actualState).toEqual(expectedState);
    });

    it('Should return status with type error when action type is error', () => {
        // given
        const expectedState = {
            type: 'error',
            title: 'some title',
            msg: 'some message',
            timeout: 2
        };

        const infoAction =  {
            type: NotificationConstants.NOTIFY_ERROR,
            data: {
                title: "some title",
                msg: "some message",
                timeout: 2
            }
        };

        // when
        const actualState = NotificationReducer(defaultState, infoAction);

        // then
        expect(actualState).toEqual(expectedState);
    });

    it('Should return status with type warning when action type is warning', () => {
        // given
        const expectedState = {
            type: 'warning',
            title: 'some title',
            msg: 'some message',
            timeout: 2
        };

        const infoAction =  {
            type: NotificationConstants.NOTIFY_WARNING,
            data: {
                title: "some title",
                msg: "some message",
                timeout: 2
            }
        };

        // when
        const actualState = NotificationReducer(defaultState, infoAction);

        // then
        expect(actualState).toEqual(expectedState);
    });

    it('Should return null when action type is close', () => {
        // given
        const expectedState = null;

        const infoAction =  {
            type: NotificationConstants.NOTIFY_CLOSE,
            data: {
                title: "some title",
                msg: "some message",
                timeout: 2
            }
        };

        // when
        const actualState = NotificationReducer(defaultState, infoAction);

        // then
        expect(actualState).toEqual(expectedState);
    });

});
