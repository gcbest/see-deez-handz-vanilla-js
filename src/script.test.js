const { LETTERS } = require('./script');

test('has all letters of alphabet', () => {
        expect(LETTERS.length).toBe(26);
});
