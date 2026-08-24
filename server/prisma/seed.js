const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding VMANOUS MySQL database...');

  // 1. Seed Summits / Programs
  await prisma.summit.deleteMany();
  await prisma.summit.createMany({
    data: [
      {
        id: 1,
        title: 'AI SUMMIT WORKSHOP 2030',
        subtitle: 'Generative AI, Prompt Engineering & Agentic LLMs',
        type: 'Flagship Event',
        college: 'G H RAISONI',
        address: 'Shradhhaa park Nagpur',
        price: 1999,
        originalPrice: 4999,
        taxRate: 18,
        taxMode: 'Exclusive',
        processingFee: 0,
        processingFeeType: 'Fixed',
        duration: '1-Day Live Workshop',
        time: '10:00 AM - 05:00 PM',
        startDate: '2026-08-30',
        endDate: '2026-08-30',
        date: '30-08-2026',
        seatCapacity: 100,
        status: 'Registration Open',
        features: ['Providing Certificate']
      },
      {
        id: 2,
        title: 'Workshop Aegentic ai',
        subtitle: 'Full-Stack AI & RAG Architecture Engineering',
        type: 'Campus Workshop',
        college: 'KDK',
        address: 'Sakardhara',
        price: 2999,
        originalPrice: 6999,
        taxRate: 18,
        taxMode: 'Exclusive',
        processingFee: 0,
        processingFeeType: 'Fixed',
        duration: '2-Day Live Workshop',
        time: '10:00 AM - 05:00 PM',
        startDate: '2026-08-20',
        endDate: '2026-08-21',
        date: '20-08-2026',
        seatCapacity: 10,
        status: 'Filling Fast',
        features: ['Expert Mentorship']
      },
      {
        id: 3,
        title: 'Data Science',
        subtitle: 'Machine Learning, PyTorch & Deep Learning Models',
        type: 'Flagship Event',
        college: 'D Y PATIL',
        address: 'Akurdi pune',
        price: 1999,
        originalPrice: 4999,
        taxRate: 18,
        taxMode: 'Exclusive',
        processingFee: 0,
        processingFeeType: 'Fixed',
        duration: '2-Day Live Workshop',
        time: '10:00 AM - 05:00 PM',
        startDate: '2026-08-20',
        endDate: '2026-08-25',
        date: 'Aug 20-25, 2026',
        seatCapacity: 150,
        status: 'Registration Open',
        features: ['Providing Certificate', '123456']
      },
      {
        id: 4,
        title: 'AI Summit Workshop 2026',
        subtitle: 'Machine Learning, PyTorch & Deep Learning Models',
        type: 'Flagship Event',
        college: 'INDIAN INSTITUTE OF TECHNOLOGY',
        address: 'Victor Menezes Convention Centre',
        price: 2999,
        originalPrice: 6999,
        taxRate: 18,
        taxMode: 'Exclusive',
        processingFee: 0,
        processingFeeType: 'Fixed',
        duration: '3-Day Hands-on Summit',
        time: '09:00 AM - 05:00 PM',
        startDate: '2026-11-14',
        endDate: '2026-11-16',
        date: 'Nov 14-16, 2026',
        seatCapacity: 100,
        status: 'Registration Open',
        features: ['Hands-on GPU Labs']
      },
      {
        id: 5,
        title: 'AI Summit Workshop 2026',
        subtitle: 'Full-Stack AI & RAG Architecture Engineering',
        type: 'Flagship Event',
        college: 'DELHI TECHNOLOGICAL UNIVERSITY',
        address: 'Delhi Campus Auditorium',
        price: 1999,
        originalPrice: 4999,
        taxRate: 18,
        taxMode: 'Exclusive',
        processingFee: 0,
        processingFeeType: 'Fixed',
        duration: '2-Day National Bootcamp',
        time: '10:00 AM - 04:00 PM',
        startDate: '2026-12-12',
        endDate: '2026-12-13',
        date: 'Dec 12-13, 2026',
        seatCapacity: 100,
        status: 'Registration Open',
        features: ['Full Stack AI']
      }
    ]
  });

  // 2. Clear Applications & Payment Transactions
  await prisma.application.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.student.deleteMany();

  console.log('Seeding completed successfully with summits!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
