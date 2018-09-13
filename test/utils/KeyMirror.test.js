import keyMirror from 'utils/KeyMirror.js';

describe('KeyMirror', () => {
  it('valid key mirror with nulls', () => {
    const obj = {
      TIER_SUPPORT: null,
      INVENTORY: null,
      VNF_SEARCH: null
    }
    const mirror = keyMirror(obj);

    for (let key in obj) {
      expect(mirror).toHaveProperty(key);
      expect(JSON.stringify(mirror[key])).toBe(JSON.stringify(Symbol(key)));
    }
  });

  it('valid key mirror with undefined', () => {
    const obj = {
      TIER_SUPPORT: undefined,
      INVENTORY: undefined,
      VNF_SEARCH: undefined
    }
    const mirror = keyMirror(obj);

    for (let key in obj) {
      expect(mirror).toHaveProperty(key);
      expect(JSON.stringify(mirror[key])).toBe(JSON.stringify(Symbol(key)));
    }
  });

  it('valid key mirror with values', () => {
    let preMirrorList = {
      TIER_SUPPORT: 'tier support',
      INVENTORY: 'inventory',
      VNF_SEARCH: 'vnf search'
    };
    const mirror = keyMirror(preMirrorList);

    for (let key in preMirrorList) {
      expect(mirror).toHaveProperty(key);
      expect(JSON.stringify(mirror[key])).toBe(JSON.stringify(preMirrorList[key]));
    }
  });

  it('valid key mirror with objects', () => {
    let preMirrorList = {
      TIER_SUPPORT: {
        name: 'tier support'
      },
      INVENTORY: {
        name: 'inventory'
      },
      VNF_SEARCH: {
        name: 'vnf search'
      }
    };
    const mirror = keyMirror(preMirrorList);

    for (let key in preMirrorList) {
      expect(mirror).toHaveProperty(key);
      expect(JSON.stringify(mirror[key])).toBe(JSON.stringify(preMirrorList[key]));
    }
  });

  it('invalid key mirror', () => {
    let preMirrorList = [
      'tier support',
      'inventory',
      'vnf search'
    ]
    const mirror = () => {
      keyMirror(preMirrorList);
    }

    expect(mirror).toThrow(Error);
    expect(mirror).toThrowError('keyMirror(...): Argument must be an object.');
  });
})
