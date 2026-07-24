const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:ReDaNiMiJoKa!123@db.flisqlldkquempspxztv.supabase.co:5432/postgres';

async function setupDatabase() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase PostgreSQL Database!');

        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        console.log('Executing Schema SQL...');
        await client.query(schemaSql);
        
        console.log('Database Schema setup completed successfully!');
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
