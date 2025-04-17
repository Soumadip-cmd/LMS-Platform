// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Preplings API Documentation',
      version: '1.0.0',
      description: 'API documentation for Preplings E-Learning Platform',
      contact: {
        name: 'Preplings Support',
        email: 'support@preplings.com',
        url: 'https://preplings.com/support'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './routes/*.js',
    './routes/*/*.js',
    './models/*.js',
    './controllers/*/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger documentation available at /api-docs');
}

export default setupSwagger;