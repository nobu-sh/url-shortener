import { Router } from 'express'
const router = Router()
import V1 from './v1'

router.get("/", (req, res) => {
  res.pond.Ok({
    status: 'healthy',
    versions: [
      {
        version: 1,
        endpoint: '/v1',
        status: 'default',
      },
    ],
  })
})

router.get("/v1", (req, res) => {
  res.pond.Ok({
    status: 'Accepting Requests',
    version: 1,
  })
})

router.use('/', V1)
router.use('/v1', V1)

export default router
