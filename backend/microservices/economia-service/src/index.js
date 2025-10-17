const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const economiaRoutes = require('./routes/economia');
const { initDatabase } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/economia', economiaRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'economia-service',
    timestamp: new Date().toISOString()
  });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    logger.info(`Economia Service running on port ${PORT}`);
  });
}).catch(error => {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
});
