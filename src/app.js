const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const patientRoutes = require('./routes/patientRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth'); // El guardia está listo
const { logger } = require('./utils/logger');
const { specs, swaggerUi } = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3002;

// --- Middlewares de Seguridad ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rate limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// --- Rutas del Microservicio (CON SEGURIDAD) ---
// Ahora 'authMiddleware' protegerá todas las rutas de pacientes
app.use('/api/patients', authMiddleware, patientRoutes);

// --- Documentación Swagger ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// --- Health check ---
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'ms-patient',
    timestamp: new Date().toISOString()
  });
});

// --- Manejo de Errores ---
app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`ms-patient service running on port ${PORT}`);
});

module.exports = app;