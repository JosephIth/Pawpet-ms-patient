const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configuración de Swagger para ms-patient
 * Documentación de API en español
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pacientes - PawPet',
      version: '1.0.0',
      description: 'Microservicio de gestión de pacientes para el sistema veterinario PawPet. Administra información de mascotas, propietarios y fotos de perfil.',
      contact: {
        name: 'PawPet Team',
        email: 'support@pawpet.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token de acceso JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
