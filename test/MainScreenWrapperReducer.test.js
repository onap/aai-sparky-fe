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

        it('action on success test', async () => {
            //given
            fetch.once(JSON.stringify(response));

            //when
            await mockStore.dispatch(extensibleViewNetworkCallback(requestUrl, postBody, paramName, curView));
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_RESPONSE_RECEIVED);
        });

        it('reducer on success test', async () => {
            //given
            fetch.once(JSON.stringify(response));

            await mockStore.dispatch(extensibleViewNetworkCallback(requestUrl, postBody, paramName, curView));

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

        it('action of failure test', async() => {
            //given
            fetch.mockRejectOnce('401');

            //when
            await mockStore.dispatch(extensibleViewNetworkCallback(requestUrl, postBody, paramName, curView));

            //then
            const [firstAction, secondAction, ...tail] = mockStore.getActions();

            expect(tail).toEqual([]);
            expect(firstAction.type).toEqual(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
            expect(secondAction.type).toEqual(aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_RESPONSE_RECEIVED);
        });

        it('reducer of failure test', async () => {
            //given
            fetch.mockRejectOnce('401');

            await mockStore.dispatch(extensibleViewNetworkCallback(requestUrl, postBody, paramName, curView));
            const [firstAction, secondAction, ...tail] = mockStore.getActions();

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

    describe.each([true, false])('showMainMenuTests', value => {
        it('action on show: ' + value + ' test', async () => {
            //when
            await mockStore.dispatch(showMainMenu(value));
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(aaiActionTypes.AAI_SHOW_MENU);
        });


        it('reducer on show: ' + value + ' test', async () => {
            //given
            await mockStore.dispatch(showMainMenu(value));
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
        it('action test', async () => {
            //when
            await mockStore.dispatch(clearExtensibleViewData());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_CLEAR_DATA);
        });

        it('reducer test', async () => {
            //given
            await mockStore.dispatch(clearExtensibleViewData());
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

        it('action msg: ' + msg + ' test', async () => {
            //when
            await mockStore.dispatch(getInvalidSearchInputEvent());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT);
        });

        it('reducer msg: ' + msg + ' test', async () => {
            //given
            await mockStore.dispatch(getInvalidSearchInputEvent());
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
            it('action ' + title + ' test', async () => {
                //given
                prepareMock();

                //when
                await mockStore.dispatch(externalUrlRequest(urlParams));
                const [action, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(action.type).toBe(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
                expect(action.data.msgText).toEqual(expectedResponse);
            });

            it('reducer ' + title + ' test', async () => {
                //given
                prepareMock();
                await mockStore.dispatch(externalUrlRequest(urlParams));
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

            beforeEach(() => {
                fetch.resetMocks();
                fetch.once(JSON.stringify(response));
            });

            it("Action on exactly one suggestion test", async () => {
                //when
                await mockStore.dispatch(externalUrlRequest(someUrlParams));
                const [firstAction, secondAction, ...rest] = mockStore.getActions();

                //then
                expect(rest).toEqual([]);
                expect(firstAction.type).toBe( globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE);
                expect(secondAction.type).toBe(contextHandlerActionTypes.SINGLE_SUGGESTION_FOUND);
            });

            it("Reducer on exactly one suggestion test", async () => {
                //given
                await mockStore.dispatch(externalUrlRequest(someUrlParams));
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

        it('Action test', async () => {
            //when
            await mockStore.dispatch(setSecondaryTitle(title));
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(aaiActionTypes.SET_SECONDARY_TITLE);
        });

        it('Reducer test', async () => {
            //given
            await mockStore.dispatch(setSecondaryTitle(title));
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
        const payloadDisabled = {subscriptionEnabled: false};
        const payloadEnabled = {subscriptionEnabled: true, subscriptionDetails: 'Foo'};

        it("Action on request rejected by server test", async () => {
           //given
            fetch.mockRejectOnce('401');

            //when
            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
            expect(action.data.msgText).toEqual(SUBSCRIPTION_FAILED_MESSAGE);
        });

        it("Reducer on request rejected by server test", async () => {
            //given
            fetch.mockRejectOnce('401');

            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ..._] = mockStore.getActions();

            //when
            const state = MainScreenWrapperReducer(initialState, action);

            //then
            expect(state).toEqual(initialState);
        });

        it("Action on disabled subscription test", async () => {
            //given
            fetch.once(JSON.stringify(payloadDisabled));

            //when
            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_EMPTY);
        });

        it("Reducer on disabled subscription test", async () => {
            //given
            fetch.once(JSON.stringify(payloadDisabled));

            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ..._] = mockStore.getActions();

            //when
            const {
                subscriptionEnabled,
                subscriptionPayload,
                ...rest
            } = MainScreenWrapperReducer(initialState, action);

            //then
            expect(rest).toEqual(initialState);
            expect(subscriptionEnabled).toBe(false);
            expect(subscriptionPayload).toEqual(undefined);
        });

        it("Action on disabled subscription test", async () => {
            //given
            fetch.once(JSON.stringify(payloadDisabled));

            //when
            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_EMPTY);
        });

        it("Reducer on disabled subscription test", async () => {
            //given
            fetch.once(JSON.stringify(payloadDisabled));

            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ..._] = mockStore.getActions();

            //when
            const {
                subscriptionEnabled,
                subscriptionPayload,
                ...rest
            } = MainScreenWrapperReducer(initialState, action);

            //then
            expect(rest).toEqual(initialState);
            expect(subscriptionEnabled).toBe(false);
            expect(subscriptionPayload).toEqual(undefined);
        });

        it("Action on enabled subscription test", async () => {
            //given
            fetch.once(JSON.stringify(payloadEnabled));

            //when
            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_FOUND);
        });

        it("Reducer on enabled subscription test", async () => {
            //given
            fetch.once(JSON.stringify(payloadEnabled));

            await mockStore.dispatch(getSubscriptionPayload());
            const [action, ..._] = mockStore.getActions();

            //when
            const {
                subscriptionEnabled,
                subscriptionPayload,
                ...rest
            } = MainScreenWrapperReducer(initialState, action);

            //then
            expect(rest).toEqual(initialState);
            expect(subscriptionEnabled).toBe(true);
            expect(subscriptionPayload).toEqual(payloadEnabled.subscriptionDetails);
        });
    });

    describe("getPersonalizationDetailsTests", () => {
        const personalizationPayload = {topLeftHeader : 'Foo', htmlDocumentTitle: 'Bar'};

        it("Action on request rejected by server test", async () => {
            //given
            fetch.mockRejectOnce('401');

            //when
            await mockStore.dispatch(getPersonalizationDetails());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE);
            expect(action.data.msgText).toEqual(PERSONALIZATION_FAILED_MESSAGE);
        });

        it("Reducer on request rejected by server test", async () => {
            //given
            fetch.mockRejectOnce('401');

            await mockStore.dispatch(getPersonalizationDetails());
            const [action, ..._] = mockStore.getActions();

            //when
            const state = MainScreenWrapperReducer(initialState, action);

            //then
            expect(state).toEqual(initialState);
        });

        it("Action on personalization payload found test", async () => {
            //given
            fetch.once(JSON.stringify(personalizationPayload));

            //when
            await mockStore.dispatch(getPersonalizationDetails());
            const [action, ...rest] = mockStore.getActions();

            //then
            expect(rest).toEqual([]);
            expect(action.type).toBe(personalizationActionTypes.PERSONALIZATION_PAYLOAD_FOUND);
        });

        it("Reducer on personalization payload found test", async () => {
            //given
            fetch.once(JSON.stringify(personalizationPayload));

            await mockStore.dispatch(getPersonalizationDetails());
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
