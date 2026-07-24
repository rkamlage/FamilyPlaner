const fs = require('fs');

const jsCode = fs.readFileSync('app.js', 'utf8');

// Mock a lightweight browser environment
const mockHtml = `
  <div id="tab-login"></div>
  <div id="tab-register"></div>
  <div id="auth-register-fields"></div>
  <div id="auth-submit-btn"></div>
  <div id="auth-overlay"></div>
  <div id="tab-friends"></div>
  <div id="kid-permissions-container"></div>
  <div id="own-family-members-list"></div>
  <div id="recurring-hobbies-list"></div>
  <div id="wish-matches-container"></div>
  <div id="wishes-full-list"></div>
`;

let elements = {};

const domHandler = {
  get: function(target, prop) {
    if (prop === 'getElementById') {
      return (id) => {
        if (!elements[id]) {
          elements[id] = {
            id: id,
            style: {},
            classList: { add: () => {}, remove: () => {} },
            className: ''
          };
        }
        return elements[id];
      };
    }
    if (prop === 'addEventListener') return () => {};
    if (prop === 'querySelector') return () => ({ textContent: '' });
    if (prop === 'getElementsByName') return () => [];
    return target[prop];
  }
};

global.document = new Proxy({ body: { classList: { add:()=>{}, remove:()=>{} } } }, domHandler);
global.window = {
  supabaseClient: {
    auth: { getSession: async () => ({ data: { session: null } }) },
    channel: () => ({ on: () => ({ subscribe: () => {} }) }),
    from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }) })
  },
  location: { reload: () => {} },
  matchMedia: () => ({ matches: false, addEventListener: ()=>{} })
};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

try {
  eval(jsCode);
  console.log("Syntax and initialization successful.");
  
  if (typeof setAuthMode === 'function') {
    setAuthMode('register');
    console.log("setAuthMode('register') executed successfully.");
    console.log("auth-register-fields display:", elements['auth-register-fields'].style.display);
  } else {
    console.error("setAuthMode is undefined!");
  }
} catch (e) {
  console.error("Evaluation error:", e);
}
