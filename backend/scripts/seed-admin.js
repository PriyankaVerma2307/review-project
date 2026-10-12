/**
 * seed-admin.js
 *
 * Creates the initial admin account in the Supabase / Postgres database.
 * Safe to run multiple times – it checks for the email first and exits
 * cleanly if the account already exists.
 *
 * Usage:
 *   node scripts/seed-admin.js
 *
 * Must be run from the /server directory so that dotenv picks up .env.
 */

'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool   = require('../config/db');

// ── Credentials ────────────────────────────────────────────────────────────
// Password rules (from authController.js):
//   - 8–16 characters
//   - at least one uppercase letter  [A-Z]
//   - at least one special character [^A-Za-z0-9]
// ───────────────────────────────────────────────────────────────────────────
const ADMIN_NAME     = 'StoreRate Admin User';   // 20–60 chars (schema constraint)
const ADMIN_EMAIL    = 'storerate.admin@gmail.com';
const ADMIN_PASSWORD = 'Admin@1234';              // satisfies all rules
const ADMIN_ADDRESS  = 'StoreRate HQ, Admin Office';
const SALT_ROUNDS    = 10;                        // matches bcrypt.hash(password, 10) in authController

async function main() {
  console.log('Connecting to database …');

  // Check if admin already exists
  const existing = await pool.query(
    'SELECT id, email FROM users WHERE email = $1',
    [ADMIN_EMAIL.toLowerCase()]
  );

  if (existing.rows.length > 0) {
    console.log(`\nAdmin account already exists (id=${existing.rows[0].id}). Nothing to do.`);
    return;
  }

  // Hash the password exactly the same way authController does
  console.log('Hashing password …');
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  // Insert admin row
  const result = await pool.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, 'admin')
     RETURNING id, name, email, role, created_at`,
    [
      ADMIN_NAME,
      ADMIN_EMAIL.toLowerCase(),
      hashedPassword,
      ADMIN_ADDRESS
    ]
  );

  const admin = result.rows[0];
  console.log('\n✅ Admin account created successfully!');
  console.log('─────────────────────────────────────');
  console.log(`  ID      : ${admin.id}`);
  console.log(`  Name    : ${admin.name}`);
  console.log(`  Email   : ${admin.email}`);
  console.log(`  Role    : ${admin.role}`);
  console.log(`  Created : ${admin.created_at}`);
  console.log('─────────────────────────────────────');
}

main()
  .catch(err => {
    console.error('\n❌ Error seeding admin:', err.message);
    process.exit(1);
  })
  .finally(() => pool.end());

