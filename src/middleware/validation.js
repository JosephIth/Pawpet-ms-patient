const Joi = require('joi');

const schemas = {
  getPatients: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sortBy: Joi.string().valid('name', 'species', 'breed', 'createdAt').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional()
  }),

  getPatientById: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  createPatient: Joi.object({
    name: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Name is required',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
    species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other').required().messages({
      'any.only': 'Species must be one of: dog, cat, bird, rabbit, hamster, fish, reptile, other',
      'any.required': 'Species is required'
    }),
    breed: Joi.string().min(1).max(50).required().messages({
      'string.min': 'Breed is required',
      'string.max': 'Breed cannot exceed 50 characters',
      'any.required': 'Breed is required'
    }),
    birthDate: Joi.date().max('now').optional(),
    gender: Joi.string().valid('male', 'female').optional(),
    color: Joi.string().max(50).optional(),
    weight: Joi.number().positive().optional(),
    microchip: Joi.string().max(20).optional(),
    notes: Joi.string().max(500).optional()
  }),

  updatePatient: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other').optional(),
    breed: Joi.string().min(1).max(50).optional(),
    birthDate: Joi.date().max('now').optional(),
    gender: Joi.string().valid('male', 'female').optional(),
    color: Joi.string().max(50).optional(),
    weight: Joi.number().positive().optional(),
    microchip: Joi.string().max(20).optional(),
    notes: Joi.string().max(500).optional()
  }),

  deletePatient: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  getPatientsByOwner: Joi.object({
    ownerId: Joi.number().integer().positive().required()
  }),

  searchPatients: Joi.object({
    query: Joi.string().max(100).optional(),
    species: Joi.string().valid('dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other').optional(),
    breed: Joi.string().max(50).optional(),
    age: Joi.number().integer().min(0).max(30).optional()
  })
};

const validateRequest = {
  getPatients: (req, res, next) => {
    const { error } = schemas.getPatients.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  },

  getPatientById: (req, res, next) => {
    const { error } = schemas.getPatientById.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  },

  createPatient: (req, res, next) => {
    const { error } = schemas.createPatient.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  },

  updatePatient: (req, res, next) => {
    const { error } = schemas.updatePatient.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  },

  deletePatient: (req, res, next) => {
    const { error } = schemas.deletePatient.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  },

  getPatientsByOwner: (req, res, next) => {
    const { error } = schemas.getPatientsByOwner.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  },

  searchPatients: (req, res, next) => {
    const { error } = schemas.searchPatients.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  }
};

module.exports = { validateRequest };
