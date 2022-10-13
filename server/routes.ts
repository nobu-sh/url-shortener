import { Router } from 'express'
const router = Router()

router.all("/", (req, res) => {
  res.pond.Ok()
})

export default router
