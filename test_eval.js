const fs = require('fs');
const js = fs.readFileSync('app.js', 'utf-8');

// Mock browser objects
global.window = {
    location: { reload: () => {} },
    supabaseClient: {
        auth: { getSession: async () => ({ data: { session: null } }) },
        from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: {}, error: null }) }) }) }),
        channel: () => ({ on: () => ({ subscribe: () => {} }) })
    }
};
global.document = {
    getElementById: () => ({
        style: {},
        classList: { add: () => {}, remove: () => {} }
    }),
    querySelector: () => ({})
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

try {
    eval(js);
    console.log('app.js evaluated successfully');
} catch (e) {
    console.error('Error evaluating app.js:', e);
}
