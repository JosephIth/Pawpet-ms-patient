const express = require('express');
// Importamos el controlador
const patientController = require('../controllers/patientController');

const router = express.Router();

// --- RUTAS SIMPLIFICADAS PARA EVITAR CRASHES ---

// Listar pacientes
router.get('/', patientController.getPatients);

// Obtener por ID
router.get('/:id', patientController.getPatientById);

// Crear paciente (Aquí estaba el error en la línea 93)
router.post('/', patientController.createPatient);

// Actualizar paciente
router.put('/:id', patientController.updatePatient);

// Eliminar paciente
router.delete('/:id', patientController.deletePatient);

// Listar por propietario
router.get('/owner/:ownerId', patientController.getPatientsByOwner);

// Buscar pacientes
router.get('/search', patientController.searchPatients);

// Subir foto
router.post('/:id/photo', patientController.uploadPhoto);

module.exports = router;