const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Body parser (Increased limit for selfie photos & large payloads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'VMANOUS MySQL API Server is running' });
});

// Mount routers
app.use('/api/v1/applications', require('./routes/applicationRoutes'));
app.use('/api/v1/summits', require('./routes/summitRoutes'));
app.use('/api/v1/students', require('./routes/studentRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/certificates', require('./routes/certificateRoutes'));


const { sendCollegeRequestEmail } = require('./services/emailService');

// College Requests Endpoint
app.post('/api/v1/college-requests', async (req, res) => {
  console.log('Received College AI Summit Request:', req.body);

  // Send Email Notification to kiran@vmanous.com
  const emailRes = await sendCollegeRequestEmail(req.body);

  res.status(200).json({
    success: true,
    message: 'College AI Summit Request received successfully',
    emailNotificationSent: emailRes.success
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => console.log(`VMANOUS Server running on port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
});

