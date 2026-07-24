const { Client } = require('pg');
const connectionString = 'postgresql://postgres:ReDaNiMiJoKa!123@db.flisqlldkquempspxztv.supabase.co:5432/postgres';

async function checkAuthUsers() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query('SELECT id, email, email_confirmed_at FROM auth.users');
        console.log('Auth Users:');
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkAuthUsers();
