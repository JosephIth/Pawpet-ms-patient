const Patient = require('../models/Patient');
const { logger } = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;

class PatientService {
  async getPatients({ page, limit, sortBy, sortOrder }) {
    try {
      const patients = await Patient.findAll({
        page,
        limit,
        sortBy,
        sortOrder
      });

      const total = await Patient.count();

      return {
        patients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting patients:', error);
      throw error;
    }
  }

  async getPatientById(id) {
    try {
      const patient = await Patient.findById(id);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return patient;
    } catch (error) {
      logger.error('Error getting patient by ID:', error);
      throw error;
    }
  }

  async createPatient(patientData) {
    try {
      // Validate required fields
      if (!patientData.name || !patientData.species || !patientData.breed) {
        throw new Error('Name, species, and breed are required');
      }

      const patient = await Patient.create(patientData);
      return patient;
    } catch (error) {
      logger.error('Error creating patient:', error);
      throw error;
    }
  }

  async updatePatient(id, updateData) {
    try {
      const patient = await Patient.update(id, updateData);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return patient;
    } catch (error) {
      logger.error('Error updating patient:', error);
      throw error;
    }
  }

  async deletePatient(id) {
    try {
      const deleted = await Patient.delete(id);
      if (!deleted) {
        throw new Error('Patient not found');
      }
      return true;
    } catch (error) {
      logger.error('Error deleting patient:', error);
      throw error;
    }
  }

  async uploadPhoto(id, file) {
    try {
      const patient = await Patient.findById(id);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../../uploads/patients');
      await fs.mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const filename = `patient_${id}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, filename);

      // Save file
      await fs.writeFile(filePath, file.buffer);

      // Update patient with photo URL
      const photoUrl = `/uploads/patients/${filename}`;
      await Patient.update(id, { photoUrl });

      return photoUrl;
    } catch (error) {
      logger.error('Error uploading patient photo:', error);
      throw error;
    }
  }

  async getPatientsByOwner(ownerId) {
    try {
      const patients = await Patient.findByOwnerId(ownerId);
      return patients;
    } catch (error) {
      logger.error('Error getting patients by owner:', error);
      throw error;
    }
  }

  async searchPatients({ query, species, breed, age }) {
    try {
      const searchCriteria = {};

      if (query) {
        searchCriteria.name = { $regex: query, $options: 'i' };
      }

      if (species) {
        searchCriteria.species = species;
      }

      if (breed) {
        searchCriteria.breed = { $regex: breed, $options: 'i' };
      }

      if (age) {
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - age;
        searchCriteria.birthDate = {
          $gte: new Date(birthYear, 0, 1),
          $lt: new Date(birthYear + 1, 0, 1)
        };
      }

      const patients = await Patient.search(searchCriteria);
      return patients;
    } catch (error) {
      logger.error('Error searching patients:', error);
      throw error;
    }
  }
}

module.exports = new PatientService();
