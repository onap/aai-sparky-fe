import {
  sortDataByField,
  dateFormatLocalTimeZoneMMDDYYYY,
  dateFormatLocalTimeZoneYYYYMMDD,
  getTicks,
  getTicksData
} from 'utils/DateTimeChartUtil.js';

describe('DateTimeChartUtil Tests', () => {
  it('sortDataByField', () => {
    let initialData = [
      {word: 'plum', number: 2},
      {word: 'apple', number: 3},
      {word: 'banana', number: 1}
    ];

    sortDataByField(initialData, 'number');
    expect(initialData[0]['number']).toBe(1);
    expect(initialData[0]['word']).toBe('banana');
    expect(initialData[1]['number']).toBe(2);
    expect(initialData[1]['word']).toBe('plum');
    expect(initialData[2]['number']).toBe(3);
    expect(initialData[2]['word']).toBe('apple');
  });

  it('dateFormatLocalTimeZoneMMDDYYYY', () => {
    const timestamp = Date.parse('Mon, 25 Dec 1995 13:30:00 GMT');
    let formattedDate = dateFormatLocalTimeZoneMMDDYYYY(timestamp);
    expect(formattedDate).toBe('12/25/1995');
  });

  it('dateFormatLocalTimeZoneYYYYMMDD', () => {
    const timestamp = Date.parse('Mon, 25 Dec 1995 13:30:00 GMT');
    let formattedDate = dateFormatLocalTimeZoneYYYYMMDD(timestamp);
    expect(formattedDate).toBe('1995-12-25');
  });

  it('getTicks', () => {
    const timestamps = [
      {timestamp: 1521691200000, date: 'Thu, 22 Mar 2018 04:00:00 GMT'},
      {timestamp: 1521777600000, date: 'Thu, 23 Mar 2018 04:00:00 GMT'},
      {timestamp: 1521950400000, date: 'Thu, 25 Mar 2018 04:00:00 GMT'},
      {timestamp: 1522296000000, date: 'Thu, 29 Mar 2018 04:00:00 GMT'}
    ];
    let ticksPerDay = getTicks(timestamps, 'timestamp');
    // expect 1 tick (timestamp) for each day between March 22 - March 29
    expect(ticksPerDay.length).toBe(8);
  });

  it('getTicks - empty data', () => {
    const timestamps = [];
    let ticksPerDay = getTicks(timestamps, 'timestamp');
    expect(ticksPerDay.length).toBe(0);
  });

  it('getTicksData', () => {
    const timestamps = [
      {timestamp: 1521691200000, date: 'Thu, 22 Mar 2018 04:00:00 GMT'},
      {timestamp: 1521777600000, date: 'Thu, 23 Mar 2018 04:00:00 GMT'},
      {timestamp: 1521950400000, date: 'Thu, 25 Mar 2018 04:00:00 GMT'},
      {timestamp: 1522296000000, date: 'Thu, 29 Mar 2018 04:00:00 GMT'}
    ];
    let ticksPerDay = getTicks(timestamps, 'timestamp');
    let mergedData = getTicksData(timestamps, ticksPerDay, 'timestamp');
    // expect original 4 objects plus 4 additional objects for the missing days
    // (4 additional objects will only have timestamp attribute, no date attribute)
    expect(mergedData.length).toBe(8);
    expect(mergedData[0]['timestamp']).toBe(1521691200000);
    expect(mergedData[0]['date']).toBe('Thu, 22 Mar 2018 04:00:00 GMT');
    expect(mergedData[1]['timestamp']).toBe(1521777600000);
    expect(mergedData[1]['date']).toBe('Thu, 23 Mar 2018 04:00:00 GMT');
    expect(mergedData[2]['timestamp']).toBe(1521950400000);
    expect(mergedData[2]['date']).toBe('Thu, 25 Mar 2018 04:00:00 GMT');
    expect(mergedData[3]['timestamp']).toBe(1522296000000);
    expect(mergedData[3]['date']).toBe('Thu, 29 Mar 2018 04:00:00 GMT');
    expect(mergedData[4]['timestamp']).toBeTruthy();
    expect(mergedData[4]['date']).toBeUndefined();
    expect(mergedData[5]['timestamp']).toBeTruthy();
    expect(mergedData[5]['date']).toBeUndefined();
    expect(mergedData[6]['timestamp']).toBeTruthy();
    expect(mergedData[6]['date']).toBeUndefined();
    expect(mergedData[7]['timestamp']).toBeTruthy();
    expect(mergedData[7]['date']).toBeUndefined();
  });

  it('getTicksData - empty data', () => {
    const timestamps = [];
    let ticksPerDay = getTicks(timestamps, 'timestamp');
    let mergedData = getTicksData(timestamps, ticksPerDay, 'timestamp');
    expect(mergedData.length).toBe(0);
  });
})
