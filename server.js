// 1) Core & Environment Setup
process.on('uncaughtException', (err) => {
  console.error(`UncaughtException: ${err.name} | ${err.message}`);
  process.exit(1);
});

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

// 2) Security Middlewares
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// 3) Logging & Debugging
const morgan = require('morgan');

// 4) Database Connection
const dbConnection = require('./config/dbconnect');
dbConnection();

// 5) Express App Initialization
const app = express();
app.disable('x-powered-by');

// 6) Apply Security Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://your-frontend.com' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(xss());
app.use(express.json({ limit: '10kb' }));

// 7) Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// 8) Rate Limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/v1', limiter);

// 9) Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 10) Routes Mounting
const mountRoutes = require('./routes');
mountRoutes(app);

// 11) Fallback Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Yasta, I kiss your hand. Focus on the URL and Method.",
  });
});

// 12) Global Error Handler
const globalError = require('./middlewares/errorMiddleware');
app.use(globalError);

// 13) Start Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// 14) Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
