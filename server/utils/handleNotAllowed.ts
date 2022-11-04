import { Express } from 'express'

/**
 * @internal
 * Route allowed methods
 */
type Methods = Record<string, boolean>

/**
 * @internal
 * Layer Handle Object
 */
interface Handle {
  stack: Layer[]
}

/**
 * @internal
 * Layer Route Object
 */
interface Route {
  path: string
  methods: Methods
}
/**
 * @internal
 * Layer Path Keys
 */
interface Key {
  name: string
}
/**
 * @internal
 * Handle Layer
 */
interface Layer {
  handle: Handle
  name: string
  path: string
  regexp: RegExp
  keys: Key[]
  route: Route
}
/**
 * @internal
 * Root App Object
 */
interface RootRouter {
  stack: Layer[]
}

// Descibed api map
export type DescribedAPI = Map<string, Methods>

/**
 * Takes route index and trys its best to parse the correct routes for it.
 * This is not well tested so it could have some kinks.
 * @internal
 * @param str Regex source string to parse
 * @returns Sanatized route
 */
function parseRegex(str: string): string {
  const parser = str
    // Remove escapes
    .replace(/\\/gi, '')
    // Remove Parameter And Query Regex
    // eslint-disable-next-line no-useless-escape
    .replace(/\?\(\?\=\/\|\$\)|\(\?\:\(\[\^\/\]\+\?\)\)/gi, '')
    // Remove any remaining hanging crap.
    .replace(/(\/+$|\$$|\/\?$)/g, '')
    // Remove the regex line begin ^
    .slice(1)
  // If the left over is this weird shit then its a wildcard
  if (parser === '(.*)') return '*'
  
  return parser
}

/**
 * Routes layer does not store path for some reason
 * only the regex for the handle. So we need to attempt
 * to reconstruct the route with the correct parameters.
 * @internal
 * @param layer Router layer
 * @returns Sanatized name
 */
function getRouterPath(layer: Layer) {
  // Get the path by parsing the regex
  let path = parseRegex(layer.regexp.source)
  // If the layer has keys (params), apply them back to the final path
  if (layer.keys.length)
    path = `${path}/${layer.keys.map(k => `:${k.name}`).join('/')}`

  return path
}

/**
 * Adds or updates the path with more methods in a map.
 * @internal
 * @param map Map to add or update to.
 * @param route Dispatcher Layer Route.
 * @param routePrefix Prefix to append to the route path (eg: parent routers)
 */
function updatePath(map: DescribedAPI, route: Route, routePrefix = ''): void {
  // Generate the complete path with and parent router prefix
  const finalPath = `${routePrefix}${route.path === '*' ? '/*' : route.path}`
  // Attempt to fetch previous data from the map
  let methods = {
    ...map.get(finalPath),
    ...route.methods,
  }

  // If there are more than or equal to 34 methods on a path its a root all handler.
  const methodAmount = Object.values(methods).filter(i => i).length
  if (methodAmount >= 34) methods = { _all: true }
  
  map.set(finalPath, methods)
}

/**
 * Takes in a router layer and attempts to recursively deconstruct all its dispatch and sub routers.
 * @internal
 * @param map Map to update info in.
 * @param layer Router layer.
 * @param pastRouterPath Past router paths to prefix (eg: parent routers).
 */
function deconstructRouter(map: DescribedAPI, layer: Layer, pastRouterPath = ''): void {
  // Create the router path ensuring to include any parent paths
  const routerPath = `${pastRouterPath}${getRouterPath(layer)}`
  // Grab the layer stack
  const stack = layer.handle.stack

  // Fetch dispatchers in layer
  const rootDispatchers = stack.filter(l => l.name === 'bound dispatch')
  // Fetch routers in layer
  const rootRouters = stack.filter(l => l.name === 'router')

  // Update the path of each dispatcher
  rootDispatchers.forEach(l => {
    updatePath(map, l.route, routerPath)
  })
  // Deconstruct each router
  rootRouters.forEach(l => {
    deconstructRouter(map, l, routerPath)
  })
}

/**
 * Recursively works through all Layers in app to describe
 * the entire api.
 * @param app Root app.
 */
export function describeApi(app: Express): DescribedAPI {
  // Create new map to hold data
  const map = new Map<string, Methods>()
  // Get the root router
  const root = app._router as RootRouter

  // Fetch dispatchers in layer
  const rootDispatchers = root.stack.filter(l => l.name === 'bound dispatch')
  // Fetch routers in layer
  const rootRouters = root.stack.filter(l => l.name === 'router')

  // Update the path of each dispatcher
  rootDispatchers.forEach(l => {
    updatePath(map, l.route)
  })

  // Deconstruct each router
  rootRouters.forEach(l => {
    deconstructRouter(map, l)
  })

  // Return described api
  return map
}

/**
 * Takes an api description. Adds backup listeners to every route
 * to handle methods that are unallowed.
 * @param api Described api.
 * @param app App we can add backup listeners to.
 */
export function handleNotAllowed(api: DescribedAPI, app: Express) {
  api.forEach((methods, path) => {
    // If all methods are caught we dont need to
    // catch mot allowed methods
    if (methods._all) return
    app.all(path, (_, res) => {
      res.pond.NotAllowed({
        allowedMethods: Object.entries(methods)
          .filter(([, v]) => v)
          .map(([k]) => k.toUpperCase()),
      })
    })
  })
}
