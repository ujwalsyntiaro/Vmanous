const prisma = require('../config/prisma');

async function clearDatabase() {
  try {
    console.log('Starting MySQL cleanup for Applications, Transactions, and Students...');
    const delTxn = await prisma.paymentTransaction.deleteMany({});
    const delApp = await prisma.application.deleteMany({});
    const delStu = await prisma.student.deleteMany({});

    console.log('Successfully cleared MySQL Database!');
    console.log(`- Deleted Payment Transactions: ${delTxn.count}`);
    console.log(`- Deleted Applications: ${delApp.count}`);
    console.log(`- Deleted Students: ${delStu.count}`);
  } catch (error) {
    console.error('Error clearing MySQL data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
