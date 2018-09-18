import {decrypt, encrypt, encode, decode} from 'utils/Crypto.js';

describe('Crypto', () => {
    it('encrypt and decrypt text properly', () => {
        // given
        const stringToEncrypt = 'textToEncrypt';

        // when
        const encryptedString = encrypt(stringToEncrypt);

        // then
        const decryptedString = decrypt(encryptedString);
        expect(decryptedString).toBe(stringToEncrypt);
    });

    it('encode and decode text properly', () => {
        // given
        const stringToEncrypt = 'textToEncode';

        // when
        const encryptedString = encode(stringToEncrypt);

        // then
        const decryptedString = decode(encryptedString);
        expect(decryptedString).toBe(stringToEncrypt);
    });

});
