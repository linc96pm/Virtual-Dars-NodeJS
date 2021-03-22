const request = require('supertest');
const { Category } = require('../../models/category');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/categories', () => {
    beforeEach(() => {
        server = require('../../index');
    });

    afterEach(async () => {
        server.close();
        await Category.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all categories', async () => {
            await Category.collection.insertMany([
                { name: 'programming' },
                { name: 'networking' },
                { name: 'UX&UI Design' },
            ]);

            const response = await request(server).get('/api/categories');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
            expect(response.body.some(cat => cat.name == 'programming')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a category if id is valid', async () => {
            const category = new Category({ name: 'artificial intelligence' });
            await category.save();

            const response = await request(server).get('/api/categories/' + category._id);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'artificial intelligence');
        });

        it('should return 404 if id is invalid', async () => {
            const response = await request(server).get('/api/categories/123');
            expect(response.status).toBe(404);
        });

        it('should return 404 if id is not found in db', async () => {
            const categoryId = mongoose.Types.ObjectId();
            const response = await request(server).get('/api/categories/' + categoryId);
            expect(response.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const execute = async () => {
            return await request(server)
                .post('/api/categories')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'programming';
        });

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await execute();
            expect(res.status).toBe(401);
        });

        it('should return 400 if category name is less than 3 characters', async () => {
            name = '12';
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it('should return 400 if category name is more than 50 characters', async () => {
            name = new Array(52).join('c');
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it('should save the category if it is valid', async () => {
            await execute();
            const category = await Category.find({ name: 'programming' });
            expect(category).not.toBeNull();
        });

        it('should return category if it is valid', async () => {
            const res = await execute();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'programming');
        });
    });
});