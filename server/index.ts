import path from 'path'
import dotenv from 'dotenv'
import { ProjectRootPath } from './Constants'
dotenv.config({ path: path.resolve(ProjectRootPath, '.env') })

import express from 'express'
import http from 'http'
import cors from 'cors'
import API from './routes'
import { responseHandler } from './utils'
import { Link } from './database/models'

const app = express()
const server = http.createServer(app)

const PORT = parseInt(process.env.PORT ?? '4000', 10) - 1

app.use(cors())

/* Handle Redirects... */
app.use('*/:idOrCustomUrl', async (req, res, next) => {
  if (req.hostname !== 'r.nobu.sh') return next()
  const attemptParseId = parseInt(req.params.idOrCustomUrl, 10)
  const linkQuery =  isNaN(attemptParseId) 
    ? Link.findOne({ where: { customUrl: req.params.idOrCustomUrl } })
    : Link.findOne({ where: { id: attemptParseId } })

  const link = await linkQuery

  // Let 404 pick it up
  if (!link) return next()

  res.redirect(301, link.getDataValue('value'))
})
/* Localhost Redirects */
if (process.env.NODE_ENV === 'development') {
  app.use('/r/:idOrCustomUrl', async (req, res) => {
    const attemptParseId = parseInt(req.params.idOrCustomUrl, 10)
    const linkQuery =  isNaN(attemptParseId) 
      ? Link.findOne({ where: { customUrl: req.params.idOrCustomUrl } })
      : Link.findOne({ where: { id: attemptParseId } })

    const link = await linkQuery
  
    // Let 404 pick it up
    if (!link) return res.redirect(301, `http://localhost:${PORT + 1}/404_${req.params.idOrCustomUrl}`)

    res.redirect(301, link.getDataValue('value'))
  })
}


app.use(express.json())
app.use(responseHandler)

app.use('/api', API)

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.resolve(process.cwd(), "client", "dist")))
  app.all('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), "client", "dist", 'index.html'))
  })
}

server.listen(PORT, () => console.log("Server Listening On Port", PORT))
