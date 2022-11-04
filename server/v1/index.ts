import { Router } from 'express'
const router = Router()

/* NOTE: API Version Roots MAY NOT utilize the root path for anything! */

import Auth from './auth'
router.use('/auth', Auth)

export default router
