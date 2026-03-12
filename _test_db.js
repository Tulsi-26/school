const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$connect()
  .then(() => { console.log('DB CONNECTED OK'); return p.$disconnect(); })
  .catch((e) => { console.log('DB ERROR:', e.message); process.exit(1); });
