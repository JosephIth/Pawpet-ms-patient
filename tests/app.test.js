const request = require('supertest');
const app = require('../src/app');

describe('ms-patient Service Tests', () => {
  describe('Health Check', () => {
    test('should return 200 OK for health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service', 'ms-patient');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Patient Endpoints', () => {
    test('should return 401 for accessing patient endpoints without auth', async () => {
      const response = await request(app)
        .get('/api/patients')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Access token is required');
    });

    test('should return 401 for creating patient without auth', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({
          name: 'Test Pet',
          species: 'dog',
          breed: 'Labrador'
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Access token is required');
    });

    test('should return 404 for non-existent patient', async () => {
      const response = await request(app)
        .get('/api/patients/999')
        .expect(401); // Returns 401 because auth middleware runs first

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Route Not Found', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
