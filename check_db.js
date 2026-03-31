const { Client } = require('pg');

async function checkDb() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Matheus123.@localhost:5432/stepforge'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables found:', res.rows.map(r => r.table_name).join(', '));
    
    await client.end();
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
}

checkDb();
