const { LETTERS } = require('./script');

test('has letters', () => {
        expect(LETTERS.length).toBe(26);
});
