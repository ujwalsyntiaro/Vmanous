const prisma = require('../config/prisma');

async function verify() {
  const appCount = await prisma.application.count();
  const txnCount = await prisma.paymentTransaction.count();
  const stuCount = await prisma.student.count();

  console.log(`CURRENT DATABASE STATUS:`);
  console.log(`Applications: ${appCount}`);
  console.log(`Payment Transactions: ${txnCount}`);
  console.log(`Students: ${stuCount}`);

  await prisma.$disconnect();
}

verify();
