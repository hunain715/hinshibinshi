// ─── ADMIN CREDENTIALS (fallback only) ──────────────────────────────────────
const ADMIN_EMAIL    = 'binshihinshi@gmail.com'
const ADMIN_PASSWORD = 'Hinshi3562@'

// ─── API URL ──────────────────────────────────────────────────────────────────
const API_BASE = 'https://hinshibinshi.com/api/index.php'

// ──────────────────────────────────────────────────────────────────────────────
//  PHP API REQUEST
// ──────────────────────────────────────────────────────────────────────────────
async function apiRequest(method, params, body = null) {
  const url = new URL(API_BASE, window.location.origin)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const opts = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url.toString(), opts)
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('Server error: invalid response')
  }
  if (!res.ok) throw new Error(json.error || `API error ${res.status}`)
  return json.data ?? json
}

// ──────────────────────────────────────────────────────────────────────────────
//  ENTITIES — direct PHP API only
// ──────────────────────────────────────────────────────────────────────────────
function makeApiEntity(name) {
  return {
    async list(orderBy = '-created_date', limit = 500) {
      return apiRequest('GET', { entity: name, action: 'list', orderBy, limit })
    },
    async get(id) {
      return apiRequest('GET', { entity: name, action: 'get', id })
    },
    async create(payload) {
      return apiRequest('POST', { entity: name, action: 'create' }, payload)
    },
    async update(id, payload) {
      return apiRequest('PATCH', { entity: name, action: 'update', id }, payload)
    },
    async delete(id) {
      return apiRequest('DELETE', { entity: name, action: 'delete', id })
    },
  }
}

// ──────────────────────────────────────────────────────────────────────────────
//  AUTH — PHP session based
// ──────────────────────────────────────────────────────────────────────────────
const authKey = 'hb_auth_v1'

// ──────────────────────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ──────────────────────────────────────────────────────────────────────────────
export const base44 = {
  app: {
    async getPublicSettings() {
      return { appName: 'Hinshi Binshi', currency: 'PKR', public: true }
    },
  },

  auth: {
    async me() {
      try {
        return await apiRequest('GET', { entity: 'Auth', action: 'me' })
      } catch {
        return null
      }
    },
    async logout() {
      try { await apiRequest('GET', { entity: 'Auth', action: 'logout' }) } catch {}
      localStorage.removeItem(authKey)
    },
    async login(email, password) {
      try {
        const user = await apiRequest('POST', { entity: 'Auth', action: 'login' }, { email, password })
        return user
      } catch (err) {
        // only fallback if PHP is completely unreachable (local dev)
        if (err.message === 'Server error: invalid response' || err.message.includes('Failed to fetch')) {
          if (email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password?.trim() === ADMIN_PASSWORD) {
            const user = { id: 'hb-admin', email: ADMIN_EMAIL, full_name: 'Hinshi Binshi Admin', role: 'admin' }
            return user
          }
          throw new Error('Invalid email or password')
        }
        throw err
      }
    },
    async register() { throw new Error('Registration is disabled.') },
  },

  entities: {
    Product:  makeApiEntity('Product'),
    Category: makeApiEntity('Category'),
    Order:    makeApiEntity('Order'),
    Customer: makeApiEntity('Customer'),
    Lead:     makeApiEntity('Lead'),
  },
}

export default base44
