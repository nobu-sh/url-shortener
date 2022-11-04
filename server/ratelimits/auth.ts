import ratelimit from 'express-rate-limit'

export const signupRatelimit = ratelimit({
  standardHeaders: true,
  legacyHeaders: true,
  max: 3,
  windowMs: 1000 * 60 * 60 * 24, // Per Day
  skipFailedRequests: true,
  handler(_, res) {
    res.pond.Ratelimit({
      notice: 'Account creation request ratelimited.',
      wait: 1000 * 60 * 60 * 24,
    })
  },
})

export const signinRatelimit = ratelimit({
  standardHeaders: true,
  legacyHeaders: true,
  max: 5,
  windowMs: 1000 * 60 * 15, // Per 15 minutes
  skipSuccessfulRequests: true,
  handler(_, res) {
    res.pond.Ratelimit({
      notice: 'Sign in ratelimited, try again in 15 minutes.',
      wait: 1000 * 60 * 15,
    })
  },
})
