import { Router } from 'express'
import { UseInvites } from '../Constants'
import {
  Invite, User, 
} from '../database/models'
import {
  check, isAuthed, validate, 
} from '../middleware'
import {
  AuthUser,
  Body, NewUser, 
} from '../types'
import {
  authUser,
  newInviteUser, newUser, 
} from '../validators'
import argon2 from 'argon2'
import {
  signinRatelimit, signupRatelimit, 
} from '../ratelimits'
import { createUserToken } from '../utils'
const router = Router()

// Check if root user exists, this dictates if we show the auth page
// or if we show the create init user page.
router.get('/', async (_, res) => {
  try {
    const init = await User.findOne({
      where: { role: 'INIT' },
      attributes: ['id'], 
    })
    res.pond.Ok({
      setup: init ? false : true,
      inviteOnly: UseInvites,
    })
  } catch (error) {
    console.error('[Server] [auth/]', error)
    res.pond.Error()
  }
})

const newUserBody = UseInvites ? newInviteUser : newUser

// Checks if init user exists if so returns forbidden
const checkInitUser = check(async (_, res, next) => {
  try {
    const init = await User.findOne({
      where: { role: 'INIT' },
      attributes: ['id'], 
    })
    if (init) return res.pond.Forbidden()
    next()
  } catch (error) {
    console.error('[Server] [checkInitUser]', error)
    res.pond.Error()
  }
})
// Checks if username is already in use. Must validate body with validate middleware before calling this
const checkUsername = check<NewUser>(async (req, res, next) => {
  try {
    const existing = await User.findOne({
      where: { username: req.body.username },
      attributes: ['id'], 
    })
    if (existing) return res.pond.BadRequest({ notice: 'Username already taken!' })
    next()
  } catch (error) {
    console.error('[Server] [checkUsername]', error)
    res.pond.Error()
  }
})
// Checks the invite key is valid
const checkInviteKey = check<NewUser>(async (req, res, next) => {
  try {
    if (!UseInvites) return next()
    if (!req.body.key) return res.pond.BadRequest({ notice: 'Invite key required!' })
    const key = await Invite.findOne({
      where: {
        value: req.body.key,
        used: false, 
      },
      attributes: ['id'],
    })
    if (!key) return res.pond.BadRequest({ notice: 'Invalid or used invite key!' })
  
    next()
  } catch (error) {
    console.error('[Server] [checkInviteKey]', error)
    res.pond.Error()
  }
})

router.post(
  '/init',
  // Check if it exists before we init a new one.
  checkInitUser,
  // Validate body
  validate(newUser),
  // Check to make sure username isn't already in use.
  checkUsername,
  async (req: Body<NewUser>, res) => {
    try {
      const hashedPassword = await argon2.hash(req.body.password)
  
      const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        role: 'INIT',
      })
  
      res.pond.Ok({
        id: user.getDataValue('id'),
        username: user.getDataValue('username'),
        role: user.getDataValue('role'),
      })
    } catch (error) {
      console.error('[Server] [auth/init/]', error)
      res.pond.Error()
    }
  },
)

router.post(
  '/signup',
  // Apply ratelimit
  signupRatelimit,
  // Validate body
  validate(newUserBody),
  // Check to make sure username isn't already in use.
  checkUsername,
  // Ensure invite key is valid
  checkInviteKey,
  async (req: Body<NewUser>, res) => {
    try {
      const hashedPassword = await argon2.hash(req.body.password)
  
      const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        role: 'USER',
      })
  
      if (UseInvites)
        await Invite.update({ used: true }, {
          where: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            value: req.body.key!,
            used: false, 
          }, 
        })
  
      res.pond.Ok({
        id: user.getDataValue('id'),
        username: user.getDataValue('username'),
        role: user.getDataValue('role'),
      })
    } catch (error) {
      console.error('[Server] [auth/signup/]', error)
      res.pond.Error()
    }
  },
)

router.post(
  '/signin',
  signinRatelimit,
  validate(authUser),
  async (req: Body<AuthUser>, res) => {
    try {
      const user = await User.findOne({ where: { username: req.body.username } })
      if (!user) return res.pond.BadRequest({ notice: 'Invalid username or password!' })
      if (!await argon2.verify(user.getDataValue('password'), req.body.password)) 
        return res.pond.BadRequest({ notice: 'Invalid username or password!' })

      res.pond.Ok({
        id: user.getDataValue('id'),
        username: user.getDataValue('username'),
        role: user.getDataValue('role'),
        accessToken: createUserToken(user.toJSON(), req.body.extended),
      })
    } catch (error) {
      console.error('[Server] [auth/signin/]', error)
      res.pond.Error()
    }
  },
)

router.get('/userinfo', isAuthed(), (_, res) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = res.user!
  res.pond.Ok({
    id: user.getDataValue('id'),
    username: user.getDataValue('username'),
    role: user.getDataValue('role'),
  })
})

export default router
