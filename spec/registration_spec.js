let registration = require('../services/register');

describe('Register a new user', function () {
    it('should return a success message after creating a user certificate.', async () => {
        let result = await registration.create_new_user('John Wick', 'Password', 'johnwick@gmail.com', '0123456789', "Louth", "Drogheda");

        expect(result).toBe('ssl/client001.p12');
    });

    it('should throw an error', async () => {
        let result;

        try {
            result = await registration.create_new_user('John Wick', 'Password', 'johnwick@gmail.com', '0123456789', "Louth", "Drogheda");
        } catch (err) {
            result = err;
        }

        expect(result).toBe('Digital Certificate creation failed.');
    });
});