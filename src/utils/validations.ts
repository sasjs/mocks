import Joi from 'joi'

export const executeProgramRawValidation = (data: any): Joi.ValidationResult =>
  Joi.object({
    _program: Joi.string().required()
  })
    .pattern(/^/, Joi.alternatives(Joi.string(), Joi.number()))
    .validate(data)
