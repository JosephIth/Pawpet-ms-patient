const { logger } = require('../utils/logger');

// Mock database for demonstration
// In a real application, you would use a database like MongoDB, PostgreSQL, etc.
let patients = [];
let nextId = 1;

class Patient {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.species = data.species; // dog, cat, bird, etc.
    this.breed = data.breed;
    this.birthDate = data.birthDate;
    this.gender = data.gender; // male, female
    this.color = data.color;
    this.weight = data.weight;
    this.microchip = data.microchip;
    this.ownerId = data.ownerId;
    this.photoUrl = data.photoUrl;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async create(patientData) {
    try {
      const patient = new Patient({
        id: nextId++,
        ...patientData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      patients.push(patient);
      logger.info(`Patient created: ${patient.name} (ID: ${patient.id})`);
      
      return patient;
    } catch (error) {
      logger.error('Error creating patient:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const patient = patients.find(p => p.id === parseInt(id));
      if (!patient) {
        return null;
      }
      
      return patient;
    } catch (error) {
      logger.error('Error finding patient by ID:', error);
      throw error;
    }
  }

  static async findByOwnerId(ownerId) {
    try {
      const ownerPatients = patients.filter(p => p.ownerId === parseInt(ownerId));
      return ownerPatients;
    } catch (error) {
      logger.error('Error finding patients by owner:', error);
      throw error;
    }
  }

  static async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = options;
      
      let sortedPatients = [...patients];
      
      // Sort patients
      sortedPatients.sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        
        if (sortOrder === 'asc') {
          return aValue.toString().localeCompare(bValue.toString());
        } else {
          return bValue.toString().localeCompare(aValue.toString());
        }
      });
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPatients = sortedPatients.slice(startIndex, endIndex);
      
      return paginatedPatients;
    } catch (error) {
      logger.error('Error finding all patients:', error);
      throw error;
    }
  }

  static async search(criteria) {
    try {
      let filteredPatients = [...patients];
      
      // Apply search filters
      if (criteria.name && criteria.name.$regex) {
        const regex = new RegExp(criteria.name.$regex, criteria.name.$options);
        filteredPatients = filteredPatients.filter(p => 
          regex.test(p.name)
        );
      }
      
      if (criteria.species) {
        filteredPatients = filteredPatients.filter(p => 
          p.species.toLowerCase() === criteria.species.toLowerCase()
        );
      }
      
      if (criteria.breed && criteria.breed.$regex) {
        const regex = new RegExp(criteria.breed.$regex, criteria.breed.$options);
        filteredPatients = filteredPatients.filter(p => 
          regex.test(p.breed)
        );
      }
      
      if (criteria.birthDate) {
        filteredPatients = filteredPatients.filter(p => {
          const patientBirthDate = new Date(p.birthDate);
          return patientBirthDate >= criteria.birthDate.$gte && 
                 patientBirthDate < criteria.birthDate.$lt;
        });
      }
      
      return filteredPatients;
    } catch (error) {
      logger.error('Error searching patients:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const patientIndex = patients.findIndex(p => p.id === parseInt(id));
      if (patientIndex === -1) {
        return null;
      }

      patients[patientIndex] = {
        ...patients[patientIndex],
        ...updateData,
        updatedAt: new Date()
      };

      logger.info(`Patient updated: ${patients[patientIndex].name} (ID: ${id})`);
      return patients[patientIndex];
    } catch (error) {
      logger.error('Error updating patient:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const patientIndex = patients.findIndex(p => p.id === parseInt(id));
      if (patientIndex === -1) {
        return false;
      }

      const deletedPatient = patients.splice(patientIndex, 1)[0];
      logger.info(`Patient deleted: ${deletedPatient.name} (ID: ${id})`);
      return true;
    } catch (error) {
      logger.error('Error deleting patient:', error);
      throw error;
    }
  }

  static async count() {
    try {
      return patients.length;
    } catch (error) {
      logger.error('Error counting patients:', error);
      throw error;
    }
  }
}

module.exports = Patient;
