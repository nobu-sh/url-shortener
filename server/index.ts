import path from 'path'
import express from 'express'
import http from 'http'
import cors from 'cors'
import API from './routes'
import {
  describeApi, handleNotAllowed, responseHandler, 
} from './utils'
import { Link } from './database/models'
import {
  PORT, RedirectHost, 
} from './Constants'

const app = express()
const server = http.createServer(app)

app.use(cors())
// -> Trust Proxy
if (process.env.NODE_ENV !== 'development') {
  app.set('trust proxy', 1)
}

/* Handle Redirects... */
app.all('*/:idOrCustomUrl', async (req, res, next) => {
  // If hostname is not RedirectHost allow continuation.
  if (req.hostname !== RedirectHost) return next()

  // Attempt to parse it as an id
  const attemptParseId = parseInt(req.params.idOrCustomUrl, 10)
  // If id is nan must be a custom url otherwise its an id
  const linkQuery =  isNaN(attemptParseId) 
    ? Link.findOne({ where: { customUrl: req.params.idOrCustomUrl } })
    : Link.findOne({ where: { id: attemptParseId } })

  // Await the link query
  const link = await linkQuery

  // If not exists let 404 frontend pick it up
  if (!link) return next()

  // Otherwise redirect
  res.redirect(301, link.getDataValue('value'))
})

/* Localhost Redirects */
if (process.env.NODE_ENV === 'development') {
  app.all('/r/:idOrCustomUrl', async (req, res) => {
    const attemptParseId = parseInt(req.params.idOrCustomUrl, 10)
    const linkQuery =  isNaN(attemptParseId) 
      ? Link.findOne({ where: { customUrl: req.params.idOrCustomUrl } })
      : Link.findOne({ where: { id: attemptParseId } })

    const link = await linkQuery
  
    // During dev env api/frontend are different urls therefore 404s on the redirecter need to be
    // redirected to the frontend with a non existent endpoint to envoke 404 
    if (!link) return res.redirect(301, `http://localhost:${PORT + 1}/404?r=${req.params.idOrCustomUrl}`)

    res.redirect(301, link.getDataValue('value'))
  })
}

// Add json parser & response handler
app.use(express.json())
app.use(responseHandler)

// Link the api router
app.use('/api', API)

// If mode is production this doubles as our file server too
// (should probably change in future serving files like this is not the best when no ssr)
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.resolve(process.cwd(), "client", "dist")))
  app.all('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), "client", "dist", 'index.html'))
  })
}

// Describe api with cool thingy I made for another project
console.log('[Server]', 'Attempting to parse and describe API!')
export const apiDescription = describeApi(app)
console.log('[Server]', 'API Described!\n', apiDescription)

// Handle not allowed method responses
handleNotAllowed(apiDescription, app)

// Make server listen
server.listen(PORT, () => console.log("[Server] Listening on port:", PORT))
