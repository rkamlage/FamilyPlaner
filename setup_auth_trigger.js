const { Client } = require('pg');
const connectionString = 'postgresql://postgres:ReDaNiMiJoKa!123@db.flisqlldkquempspxztv.supabase.co:5432/postgres';

async function disableEmailConfirmations() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query(`
            CREATE OR REPLACE FUNCTION public.auto_confirm_email()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.email_confirmed_at = now();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
            
            DROP TRIGGER IF EXISTS auto_confirm_email ON auth.users;
            CREATE TRIGGER auto_confirm_email
            BEFORE INSERT ON auth.users
            FOR EACH ROW EXECUTE PROCEDURE public.auto_confirm_email();
        `);
        console.log('Successfully created auto-confirm trigger for auth.users!');
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

disableEmailConfirmations();
