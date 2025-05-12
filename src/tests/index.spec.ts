import request from 'supertest';
import { IUser } from '../interfaces/user.interface';
import { StatusCodesEnum } from '../enums/status-codes.enum';
import { server } from '../create-server';

const currentObject: IUser = {
    userName: 'John',
    age: 34,
    hobbies: ['playing games', 'tennis'],
};

const newObject: IUser = {
    userName: 'Vicky',
    age: 12,
    hobbies: ['dolls'],
};

const invalidID = '912f67d5-9073-4270-9142-e7543930fd7d';

describe('RSS CRUD API TESTS', () => {
    const res = request(server);

    test('should return empty array ', async () => {
        const response = await res.get('/api/users');
        expect(response.status).toBe(StatusCodesEnum.SUCCESS);
        expect(JSON.parse(response.text)).toEqual([]);
        server.close();
    });

    test('should create and return user object', async () => {
        const response = await res.post('/api/users').send(currentObject);
        expect(response.status).toBe(StatusCodesEnum.CREATE);
        const { id } = response.body;

        const newObj = {
            id,
            ...currentObject,
        };

        const responseGet = await res.get('/api/users');
        expect(responseGet.status).toBe(StatusCodesEnum.SUCCESS);
        expect(JSON.parse(responseGet.text)).toEqual([newObj]);
        server.close();
    });

    test('should update user', async () => {
        const response = await res.post('/api/users').send(currentObject);
        expect(response.status).toBe(StatusCodesEnum.CREATE);
        const { id } = response.body;

        const getPutRequest = await res.put(`/api/users/${id}`).send(newObject);

        expect(getPutRequest.status).toBe(StatusCodesEnum.SUCCESS);
        expect(JSON.parse(getPutRequest.text)).toEqual(newObject);
        server.close();
    });

    test('should delete user', async () => {
        const response = await res.post('/api/users').send(currentObject);
        expect(response.status).toBe(StatusCodesEnum.CREATE);
        const { id } = response.body;

        const getDeleteRequest = await res.delete(`/api/users/${id}`);
        expect(getDeleteRequest.status).toBe(StatusCodesEnum.DELETE);
        server.close();
    });

    test("should return error", async () => {
        const response = await res.post('/api/users').send(currentObject);
        expect(response.status).toBe(StatusCodesEnum.CREATE);

        const getRequest = await res.get(`/api/users/${invalidID}`);
        expect(getRequest.status).toBe(StatusCodesEnum.NOT_FOUND);
        server.close();
    });

    test('should show error on the same user double deleting', async () => {
        const response = await res.post('/api/users').send(currentObject);
        expect(response.status).toBe(StatusCodesEnum.CREATE);
        const { id } = response.body;

        const getDeleteRequest = await res.delete(`/api/users/${id}`);
        expect(getDeleteRequest.status).toBe(StatusCodesEnum.DELETE);

        const getUserRequest = await res.delete(`/api/users/${id}`);
        expect(getUserRequest.status).toBe(StatusCodesEnum.NOT_FOUND);
        server.close();
    });
});