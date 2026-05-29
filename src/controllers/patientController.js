const patientService = require('../services/patientService');
const { logger } = require('../utils/logger');

// Exportación directa de cada función para evitar errores de "undefined" en las rutas
exports.getPatients = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
        const result = await patientService.getPatients({
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder
        });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

exports.getPatientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await patientService.getPatientById(id);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        next(error);
    }
};

exports.createPatient = async (req, res, next) => {
    try {
        const patientData = {
            ...req.body,
            ownerId: req.user ? req.user.id : null // Evita que explote si no hay usuario en la req
        };
        const patient = await patientService.createPatient(patientData);
        logger.info(`Patient created: ${patient.name} (ID: ${patient.id})`);
        res.status(201).json({ success: true, message: 'Patient created successfully', data: patient });
    } catch (error) {
        next(error);
    }
};

exports.updatePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await patientService.updatePatient(id, req.body);
        logger.info(`Patient updated: ${patient.name} (ID: ${patient.id})`);
        res.status(200).json({ success: true, message: 'Patient updated successfully', data: patient });
    } catch (error) {
        next(error);
    }
};

exports.deletePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        await patientService.deletePatient(id);
        logger.info(`Patient deleted: ID ${id}`);
        res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.uploadPhoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No photo file provided' });
        }
        const photoUrl = await patientService.uploadPhoto(id, req.file);
        logger.info(`Photo uploaded for patient: ID ${id}`);
        res.status(200).json({ success: true, message: 'Photo uploaded successfully', data: { photoUrl } });
    } catch (error) {
        next(error);
    }
};

exports.getPatientsByOwner = async (req, res, next) => {
    try {
        const patients = await patientService.getPatientsByOwner(req.params.ownerId);
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        next(error);
    }
};

exports.searchPatients = async (req, res, next) => {
    try {
        const { query, species, breed, age } = req.query;
        const patients = await patientService.searchPatients({
            query, species, breed, age: age ? parseInt(age) : undefined
        });
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        next(error);
    }
};