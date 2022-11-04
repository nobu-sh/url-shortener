import joi from 'joi'

export const newUser = joi.object({
  username: joi.string().min(1)
    .max(32)
    .required()
    // A-Z a-z 0-9 _
    .regex(/^\w+$/),
  password: joi.string().min(5)
    .max(64)
    .required()
    // A-Z a-z 0-9 _ @ # $ % ^ & *
    .regex(/^[a-zA-Z0-9_!@#$%^&*]+$/),
})

export const newInviteUser = joi.object({
  username: joi.string().min(1)
    .max(32)
    .required()
    // A-Z a-z 0-9 _
    .regex(/^\w+$/),
  password: joi.string().min(5)
    .max(64)
    .required()
    // A-Z a-z 0-9 _ @ # $ % ^ & *
    .regex(/^[a-zA-Z0-9_!@#$%^&*]+$/),
  key: joi.string().length(36)
    .required(),
})

export const authUser = joi.object({
  username: joi.string().min(1)
    .max(32)
    .required()
    // A-Z a-z 0-9 _
    .regex(/^\w+$/),
  password: joi.string().min(5)
    .max(64)
    .required()
    // A-Z a-z 0-9 _ @ # $ % ^ & *
    .regex(/^[a-zA-Z0-9_!@#$%^&*]+$/),
  extended: joi.boolean().optional(),
})
