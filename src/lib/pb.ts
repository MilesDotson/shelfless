import PocketBase from 'pocketbase'

// In production uses relative URL (proxied by nginx), in dev use the server directly
const pb = new PocketBase(
  import.meta.env.DEV ? 'http://161.153.48.193' : '/'
)

export default pb
