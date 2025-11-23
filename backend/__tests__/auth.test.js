const request = require('supertest');
const app = require('../app');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

describe('Auth', () => {
    test('Server Health', async () => {
        const res = await request(app).get('/check');
        expect(res.statusCode).toBe(200);
    });

    test('User registers', async () => {
        const res = await request(app).post('/api/auth/register').send({ email: 'test@mail.com', password: 'pass1234' });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User created');
    });

    test('User logs in', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: 'test@mail.com', password: 'pass1234' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
