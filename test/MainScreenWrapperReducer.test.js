import thunk from 'redux-thunk';
import randstr from 'randomstring';
import configureMockStore from 'redux-mock-store';

import MainScreenWrapperReducer from 'app/MainScreenWrapperReducer'
import {aaiActionTypes} from 'app/MainScreenWrapperConstants';
import {getPersonalizationDetails} from 'app/personlaization/PersonalizationActions';
import {getInvalidSearchInputEvent} from'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarActions';
import {extensibleViewNetworkCallback, showMainMenu, clearExtensibleViewData, setSecondaryTitle} from 'app/MainScreenWrapperActionHelper';
import {externalUrlRequest, getSubscriptionPayload} from 'app/contextHandler/ContextHandlerActions'

import {globalInlineMessageBarActionTypes} from "app/globalInlineMessageBar/GlobalInlineMessageBarConstants";
import {globalAutoCompleteSearchBarActionTypes} from "app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants";
import {
    contextHandlerActionTypes,
    FAILED_REQUEST,
    MULTIPLE_RESULT, SUBSCRIPTION_FAILED_MESSAGE,
    WRONG_EXTERNAL_REQUEST_MESSAGE,
    WRONG_RESULT,
    ZERO_RESULT
} from "app/contextHandler/ContextHandlerConstants";
import {PERSONALIZATION_FAILED_MESSAGE, personalizationActionTypes} from "app/personlaization/PersonalizationConstans";

describe('MainScreenWrapperReducerTests', () => {
    fetch = require('jest-fetch-mock');
    const mockStore = configureMockStore([thunk])();
    const initialState = {Baz : 'Fooo'};
    const error = '401';

    beforeEach(() => {
        fetch.resetMocks();
        mockStore.clearActions();
    });

    describe('extensibleViewNetworkCallbackTests', () => {
        const paramName = 'boo';
        const postBody = 'baz';
        const curView = {Boz : 'Fooz'};
        const requestUrl = 'www.foo.com';
        const response = {Foo: 'Bar'};

        describe('success tests', () => {
            beforeEach(async () => {
                //given
                fetch.once(JSON.stringify(response));
                await mockStore.dispatch(extensibleViewNetworkCallback(requestUrl, postBody, paramName, curView));
            });

            it('action on success test', () => {
                //when
                const [action, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(action.type).toBe(aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_RESPONSE_RECEIVED);
            });

            it('reducer on success test', () => {
                //given
                const [action, ..._] = mockStore.getActions();

                //when
                const {
                    extensibleViewNetworkCallbackData,
                    ...rest
                } = MainScreenWrapperReducer(initialState, action);

                //then
                expect(rest).toEqual(initialState);
                expect(extensibleViewNetworkCallbackData).toEqual({
                    boo: response,
                    ...curView
                });
            });
        });

        describe('failure tests', () => {
            beforeEach(async () => {
                //given
                fetch.mockRejectOnce(error);
                await mockStore.dispatch(extensibleViewNetworkCallback(requestUrl, postBody, paramName, curView));
            });

            it('action on failure test', () => {
                //given
                const [firstAction, secondAction, ...tail] = mockStore.getActions();

                //then
                expect(tail).toEqual([]);
                expect(firstAction.type).toEqual(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
                expect(secondAction.type).toEqual(aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_RESPONSE_RECEIVED);
            });

            it('reducer on failure test', () => {
                //given
                const [firstAction, secondAction, ..._] = mockStore.getActions();

                //when
                const afterFirstState = MainScreenWrapperReducer(initialState, firstAction);
                const {
                    extensibleViewNetworkCallbackData,
                    ...rest
                } = MainScreenWrapperReducer(initialState, secondAction);

                //then
                expect(afterFirstState).toEqual(initialState);
                expect(rest).toEqual(initialState);
                expect(extensibleViewNetworkCallbackData).toEqual({
                    boo: {},
                    ...curView
                });
            });
        });
    });

    describe.each([true, false])('showMainMenuTests', value => {
        beforeEach(async () => {
            //given
            await mockStore.dispatch(showMainMenu(value));
        });

        it('action on show: ' + value + ' test', () => {
            //when
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(aaiActionTypes.AAI_SHOW_MENU);
        });

        it('reducer on show: ' + value + ' test', () => {
            //given
            const [action, ..._] = mockStore.getActions();

            //when
            const {
                showMenu,
                toggleButtonActive,
                ...rest
            } = MainScreenWrapperReducer(initialState, action);

            //then
            expect(rest).toEqual(initialState);
            expect(showMenu).toBe(value);
            expect(toggleButtonActive).toBe(value);
        });
    });

    describe('clearExtensibleViewDataTests', () => {
        beforeEach(async () => {
            //given
            await mockStore.dispatch(clearExtensibleViewData());
        });

        it('action test', () => {
            //when
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_CLEAR_DATA);
        });

        it('reducer test', () => {
            //given
            const [action, ..._] = mockStore.getActions();

            //when
            const {
                extensibleViewNetworkCallbackData,
                ...rest
            } = MainScreenWrapperReducer(initialState, action);

            expect(rest).toEqual(initialState);
            expect(extensibleViewNetworkCallbackData).toEqual({});
        });
    });

    describe('getInvalidSearchInputEventTests', () => {
        const msg = randstr.generate();

        beforeEach(async () => {
            await mockStore.dispatch(getInvalidSearchInputEvent(msg));
        });

        it('action msg: ' + msg + ' test', () => {
            //when
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT);
        });

        it('reducer msg: ' + msg + ' test', () => {
            //given
            const [action, ..._] = mockStore.getActions();

            //when
            const {
                extensibleViewNetworkCallbackData,
                ...rest
            } = MainScreenWrapperReducer(initialState, action);

            //then
            expect(rest).toEqual(initialState);
            expect(extensibleViewNetworkCallbackData).toEqual({clearView : true});
        });
    });

    describe('externalUrlRequestTests', () => {
        const someUrlParams = 'view=A&entityId=B&entityType=C';

        describe.each([{
            title: 'on empty url params',
            prepareMock: () => {},
            urlParams: '',
            expectedResponse: WRONG_EXTERNAL_REQUEST_MESSAGE
        }, {
            title: 'on request rejected by the server',
            prepareMock: () => fetch.mockRejectOnce('401'),
            urlParams: someUrlParams,
            expectedResponse: FAILED_REQUEST
        }, {
                title: 'on empty suggestions',
                prepareMock: () => fetch.once(JSON.stringify({})),
                urlParams: someUrlParams,
                expectedResponse: WRONG_RESULT
        }, {
            title: 'on no results',
            prepareMock: () => fetch.once(JSON.stringify({totalFound: 0, suggestions: []})),
            urlParams: someUrlParams,
            expectedResponse: ZERO_RESULT
        }, {
            title: 'on multiple results',
            prepareMock: () => fetch.once(JSON.stringify({totalFound: 2, suggestions: ['Foo', 'Bar']})),
            urlParams: someUrlParams,
            expectedResponse: MULTIPLE_RESULT
        }])('failure tests', ({title, prepareMock, urlParams, expectedResponse}) => {
            beforeEach(async () => {
                //given
                prepareMock();
                await mockStore.dispatch(externalUrlRequest(urlParams));
            });

            it('action ' + title + ' test', () => {
                //when
                const [action, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(action.type).toBe(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
                expect(action.data.msgText).toEqual(expectedResponse);
            });

            it('reducer ' + title + ' test', () => {
                //given
                const [action, ..._] = mockStore.getActions();

                //when
                const state = MainScreenWrapperReducer(initialState, action);

                //then
                expect(state).toEqual(initialState);
            });
        });

        describe("success tests", () => {
            //given
            const response = {totalFound: 1, suggestions: ['Foo']};

            beforeEach(async () => {
                //given
                fetch.resetMocks();
                fetch.once(JSON.stringify(response));

                await mockStore.dispatch(externalUrlRequest(someUrlParams));
            });

            it('action on exactly one suggestion test', () => {
                //when
                const [firstAction, secondAction, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(firstAction.type).toBe( globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE);
                expect(secondAction.type).toBe(contextHandlerActionTypes.SINGLE_SUGGESTION_FOUND);
            });

            it('reducer on exactly one suggestion test', () => {
                //given
                const [firstAction, secondAction, ..._] = mockStore.getActions();

                //when
                const state = MainScreenWrapperReducer(initialState, firstAction);
                const {
                    externalRequestFound,
                    ...rest
                } = MainScreenWrapperReducer(state, secondAction);

                //then
                expect(state).toEqual(initialState);
                expect(rest).toEqual(initialState);
                expect(externalRequestFound).toEqual({suggestion: response.suggestions[0]});
            });
        });
    });

    describe('setSecondaryTitleTests', () => {
        //given
        const title = randstr.generate();

        beforeEach(async () => {
            //given
            await mockStore.dispatch(setSecondaryTitle(title));
        });

        it('action test', () => {
            //when
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(aaiActionTypes.SET_SECONDARY_TITLE);
        });

        it('reducer test', () => {
            //given
            const [action, ..._] = mockStore.getActions();

            //when
            const {
                secondaryTitle,
                ...rest
            } = MainScreenWrapperReducer(initialState, action);

             //then
            expect(rest).toEqual(initialState);
            expect(secondaryTitle).toEqual(title);
        });
    });

    describe('getSubscriptionPayloadTests', () => {
        describe('failure tests', () => {
            beforeEach(async () => {
                //given
                fetch.mockRejectOnce(error);
                await mockStore.dispatch(getSubscriptionPayload());
            });

            it('action on request rejected by server test', async () => {
                //when
                const [action, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(action.type).toBe(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
                expect(action.data.msgText).toEqual(SUBSCRIPTION_FAILED_MESSAGE);
            });

            it('reducer on request rejected by server test', async () => {
                //given
                const [action, ..._] = mockStore.getActions();

                //when
                const state = MainScreenWrapperReducer(initialState, action);

                //then
                expect(state).toEqual(initialState);
            });
        });

        const subscriptionData = 'Foo';

        describe.each([{
            title: 'on disabled subscription',
            payload: {subscriptionEnabled: false},
            type: contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_EMPTY,
            detail : undefined
        }, {
            title: 'on enabled subscription',
            payload: {subscriptionEnabled: true, subscriptionDetails: subscriptionData},
            type: contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_FOUND,
            detail : subscriptionData
        }])('success tests', ({title, payload, type, detail}) => {
            beforeEach(async () => {
                //given
                fetch.once(JSON.stringify(payload));
                await mockStore.dispatch(getSubscriptionPayload());
            });

            it('action ' + title + ' test', () => {
                //when
                const [action, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(action.type).toBe(type);
            });

            it('reducer '  + title + '  test', () => {
                //given
                const [action, ..._] = mockStore.getActions();

                //when
                const {
                    subscriptionEnabled,
                    subscriptionPayload,
                    ...rest
                } = MainScreenWrapperReducer(initialState, action);

                //then
                expect(rest).toEqual(initialState);
                expect(subscriptionEnabled).toBe(payload.subscriptionEnabled);
                expect(subscriptionPayload).toEqual(detail);
            });
        });
    });

    describe("getPersonalizationDetailsTests", () => {
        describe('failure tests', () => {
            beforeEach(async () => {
                //given
                fetch.mockRejectOnce(error);
                await mockStore.dispatch(getPersonalizationDetails());
            });

            it('action on request rejected by server test', () => {
                //when
                const [action, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(action.type).toBe(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
                expect(action.data.msgText).toEqual(PERSONALIZATION_FAILED_MESSAGE);
            });

            it('reducer on request rejected by server test', () => {
                //given
                const [action, ..._] = mockStore.getActions();

                //when
                const state = MainScreenWrapperReducer(initialState, action);

                //then
                expect(state).toEqual(initialState);
            });
        });

        describe('success tests', () => {
            const personalizationPayload = {topLeftHeader: 'Foo', htmlDocumentTitle: 'Bar'};

            beforeEach(async () => {
                //given
                fetch.once(JSON.stringify(personalizationPayload));
                await mockStore.dispatch(getPersonalizationDetails());
            });

            it('action on personalization payload found test', () => {
                //when
                const [action, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(action.type).toBe(personalizationActionTypes.PERSONALIZATION_PAYLOAD_FOUND);
            });

            it("Reducer on personalization payload found test", async () => {
                //given
                const [action, ..._] = mockStore.getActions();

                //when
                const {
                    aaiTopLeftPersonalizedHeader,
                    aaiPersonalizedHtmlDocumentTitle,
                    ...rest
                } = MainScreenWrapperReducer(initialState, action);

                //then
                expect(rest).toEqual(initialState);
                expect(aaiTopLeftPersonalizedHeader).toEqual(personalizationPayload.topLeftHeader);
                expect(aaiPersonalizedHtmlDocumentTitle).toEqual(personalizationPayload.htmlDocumentTitle);
            });
        });
    });
});
