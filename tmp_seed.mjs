// Using native fetch from Node.js (available in v18+)

const SUPABASE_URL = 'https://xumlcfkmrlbwarbarpha.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bWxjZmttcmxid2FyYmFycGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NzYzMjQsImV4cCI6MjA5MDU1MjMyNH0.wMmmgFAyn6wyT7eypco_utOvY9MzFBT7MQlBaf4oB9o';

async function run() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  };

  console.log('--- SEEDING DATABASE ---');

  // 1. Verifications (Target 10)
  const currentVerifications = await fetch(`${SUPABASE_URL}/rest/v1/verifications?select=id`, { headers }).then(r => r.json());
  const neededVerifications = 10 - currentVerifications.length;
  
  if (neededVerifications > 0) {
    const names = ["Ramesh Kumar Patil", "Anita B. Deshmukh", "Suresh M. Naik", "Lakshmi R. Gowda", "Mahesh P. Kulkarni", "Sunitha R. Hegde", "Prakash J. Rao", "Vimala S. Shetty", "Karthik M.", "Deepa R."];
    const newVerifications = Array.from({ length: neededVerifications }, (_, i) => ({
      beneficiary_name: names[i % names.length],
      verdict: i % 3 === 0 ? 'FLAGGED' : (i % 5 === 0 ? 'CRITICAL' : 'ELIGIBLE'),
      aadhaar_hash: `AADH${(100 + i)}`,
      verified_at: new Date(Date.now() - i * 3600000).toISOString()
    }));
    const res = await fetch(`${SUPABASE_URL}/rest/v1/verifications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newVerifications)
    });
    console.log(`Added ${neededVerifications} verifications. Status: ${res.status}`);
  }

  // 2. Beneficiaries (Target 15)
  const currentBeneficiaries = await fetch(`${SUPABASE_URL}/rest/v1/beneficiaries?select=id`, { headers }).then(r => r.json());
  const neededBeneficiaries = 15 - currentBeneficiaries.length;
  
  if (neededBeneficiaries > 0) {
    const newBeneficiaries = Array.from({ length: neededBeneficiaries }, (_, i) => ({
      full_name: `Beneficiary ${currentBeneficiaries.length + i + 1}`,
      aadhaar_hash: `AADH${(currentBeneficiaries.length + i + 1).toString().padStart(3, '0')}`,
      phone: `9876543${(100 + i)}`,
      district: ['Mysuru', 'Belagavi', 'Kalaburagi', 'Bidar', 'Tumakuru'][i % 5],
      bank_account: `BANK${(1000 + i)}`
    }));
    const res = await fetch(`${SUPABASE_URL}/rest/v1/beneficiaries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newBeneficiaries)
    });
    console.log(`Added ${neededBeneficiaries} beneficiaries. Status: ${res.status}`);
  }
}

run().catch(console.error);
