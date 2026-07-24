const fs = require('fs');
const jsCode = fs.readFileSync('app.js', 'utf8');

const listeners = {};
const mockElements = {
  'auth-overlay': { style: {} },
  'wish-matches-container': { innerHTML: '' },
  'wishes-full-list': { innerHTML: '' },
  'recurring-hobbies-list': { innerHTML: '' },
  'own-family-members-list': { innerHTML: '' },
  'kid-permissions-container': { innerHTML: '' },
};

global.document = {
  addEventListener: (event, cb) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
  },
  getElementById: (id) => mockElements[id] || { style: {}, classList: { add: ()=>{}, remove: ()=>{} }, innerHTML: '' },
  querySelectorAll: () => [],
  body: { classList: { add: ()=>{}, remove: ()=>{} } }
};

global.window = {
  supabaseClient: {
    auth: { getSession: async () => ({ data: { session: null } }) },
    channel: () => ({ on: () => ({ subscribe: () => {} }) }),
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), limit: () => ({ data: null, error: null }) }) }) })
  },
  location: { reload: () => {} },
  matchMedia: () => ({ matches: false, addEventListener: ()=>{} })
};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

try {
  eval(jsCode);
  console.log("App evaluated. Firing DOMContentLoaded...");
  if (listeners['DOMContentLoaded']) {
    listeners['DOMContentLoaded'].forEach(cb => cb());
  }
  console.log("DOMContentLoaded fired.");
} catch (e) {
  console.error("Error:", e);
}
