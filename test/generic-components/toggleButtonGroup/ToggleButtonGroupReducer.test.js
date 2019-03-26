import React from 'react';
import reducer from 'generic-components/toggleButtonGroup/ToggleButtonGroupReducer';
import {BUTTON_TOGGLED} from 'generic-components/toggleButtonGroup/ToggleButtonGroupConstants';
import ToggleButtonGroupActions from 'generic-components/toggleButtonGroup/ToggleButtonGroupActions';

describe('ToggleButtonGroupReducer', () => {
  const SOME_DATA = "Something";
  const BUTTON_X = "ButtonX";
  const BUTTON_Y = "ButtonY";

  it('Should init state when state undefined', () => {
    // Given
    const initialState = undefined;

    // When
    const resultState = reducer(initialState, {type: "SomeAction", data: {}});

    // Then
    expect(resultState).toEqual({});
  });

  it('Should return empty state when unknown action called and empty initial state', () => {
    // Given
    const initialState = {};

    // When
    const resultState = reducer(initialState, {type: "SomeAction", data: {}});

    // Then
    expect(resultState).toEqual(initialState);
  });


  it('Should return selected button when onToggle action called and empty initial state', () => {
    // Given
    const initialState = {};
    const desiredState = {selectedButton: BUTTON_X};

    // When
    const resultState = reducer(initialState, ToggleButtonGroupActions.onToggle({button: BUTTON_X}));

    // Then
    expect(resultState).toEqual(desiredState);
  });

  it('Should return same state when unknown action called', () => {
    // Given
    const initialState = {someData: SOME_DATA};

    // When
    const resultState = reducer(initialState, {type: "SomeAction", data: {}});

    // Then
    expect(resultState).toEqual(initialState);
  });

  it('Should append selected button when onToggle action called', () => {
    // Given
    const initialState = {someData: SOME_DATA};
    const desiredState = {someData: SOME_DATA, selectedButton: BUTTON_X};

    // When
    const resultState = reducer(initialState, ToggleButtonGroupActions.onToggle({button: BUTTON_X}));

    // Then
    expect(resultState).toEqual(desiredState);
  });

  it('Should toggle last button when onToggle called multiple times', () => {
    // Given
    const initialState = {someData: SOME_DATA};
    const desiredState = {someData: SOME_DATA, selectedButton: BUTTON_Y};

    // When
    const tmpState = reducer(initialState, ToggleButtonGroupActions.onToggle({button: BUTTON_X}));
    const resultState = reducer(tmpState, ToggleButtonGroupActions.onToggle({button: BUTTON_Y}));

    // Then
    expect(resultState).toEqual(desiredState);
  });
});
