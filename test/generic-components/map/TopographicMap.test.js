import TopographicMap from 'generic-components/map/TopographicMap'
import {PROJECTION_TYPES} from "generic-components/map/MapConstants.js"
import React from 'react';
import {shallow, mount} from 'enzyme'

describe('Utility methods tests', () => {
    const sut = shallow(<TopographicMap/>).instance();

    describe('areArraysEqual tests', () => {
        it('Empty arrays should be equal', () => {
             expect(sut.areArraysEqual([], [])).toBe(true);
        });

        it('Nested empty arrays should be equal', () => {
            expect(sut.areArraysEqual([[]], [[]])).toBe(true);
            expect(sut.areArraysEqual([[],[]], [[],[]])).toBe(true);
        });

        it('A nested empty array should not be equal to an empty array', () => {
            expect(sut.areArraysEqual([[]], [])).toBe(false);
        });

        it('Should not coerce elements', () => {
            expect(sut.areArraysEqual([undefined], [null])).toBe(false);
            expect(sut.areArraysEqual([['x']],['x'])).toBe(true);
            expect(sut.areArraysEqual([['xx']],['xx'])).toBe(false);
            expect(sut.areArraysEqual([true], ["true"])).toBe(false);
            expect(sut.areArraysEqual([1], ["1"])).toBe(false);
        });
    });

    describe('extractNestedObjectInJson tests', () => {
        it('Should return an empty object from an empty object', () => {
            expect(sut.extractNestedObjectInJson({},['a'])).toBeUndefined();
            expect(sut.extractNestedObjectInJson({},['a', 'b'])).toBeUndefined();
        });

        it('Should extract a nested element', () => {
            const value = "Foo";
            expect(sut.extractNestedObjectInJson({a:{b: value}},['a', 'b'])).toBe(value);
        });
    });
});

describe('TopographicMap integration tests', () => {
    const svgTag = 'svg';
    const circleTag = 'circle';

    const worldBounds = [
        {longtitude: 28.70, latitude: -127.50},
        {longtitude: 48.85, latitude: -55.90}];

    const outsideUSA = [{longitude: 19.145136, latitude: 51.919438}];
    const insideUSA = [
        {longitude:-122.4196396, latitude:37.7771187},
        {longitude:-122.4196396, latitude:37.6771187},
        {longitude:-122.4196396, latitude:37.5771187},
        {longitude:-122.4196396, latitude:37.4771187}];

    describe('AlbertsUSA projection tests', () => {
        it('Points outside USA should not be supported', () => {
            expect(() => mount(<TopographicMap pointArray={outsideUSA} />)).toThrow();
            expect(() => mount(<TopographicMap pointArray={outsideUSA.concat(insideUSA)} />)).toThrow();
            expect(() => mount(<TopographicMap pointArray={insideUSA.concat(outsideUSA)} />)).toThrow();
        });

        it('Should generate n points on a map', () => {
            const sut = mount(<TopographicMap pointArray={insideUSA} />);
            expect(sut.find(svgTag).find(circleTag).length).toBe(insideUSA.length);
        });
    });

    describe('Equirectangular projection tests', () => {
        function createEquirectangularProjection(points) {
            return mount(<TopographicMap currentProjection={PROJECTION_TYPES.EQUIRECTANGULAR} pointArray={points} />);
        }

        it('Should display points', () => {
            const sutInsideUSA = createEquirectangularProjection(insideUSA);
            const sutOutsideUSA = createEquirectangularProjection(outsideUSA);
            const sutMixed = createEquirectangularProjection(insideUSA.concat(outsideUSA));

            expect(sutInsideUSA.find(svgTag).find(circleTag).length).toBe(insideUSA.length);
            expect(sutOutsideUSA.find(svgTag).find(circleTag).length).toBe(outsideUSA.length);
            expect(sutMixed.find(svgTag).find(circleTag).length).toBe(insideUSA.length + outsideUSA.length);
        });
    });
});
