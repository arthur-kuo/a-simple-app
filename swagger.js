const swaggerAutogen = require('swagger-autogen')();

const doc = {
  swagger: '2.0',
  info: {
    title: 'A Simple App',
    version: '1.0.0',
    description: 'This document is for a-simple-app back-end API',
  },
  basePath: '/',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  definitions: {
    User: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      loginCount: 5,
      lastSession: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    UserStats: {
      totalUsers: 100,
      activeSessionsToday: 50,
      avgActiveSessions: '45.50',
    },
  },
};

const options = {
  openapi: '3.0.0',
  autoHeaders: true,
  autoQuery: true,
  autoBody: true,
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
