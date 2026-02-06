/**
 * Punto de Encuentro - API Server
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { getDatabase } from './database/index.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: config.nodeEnv === 'production' 
      ? [config.frontendUrl, /\.vercel\.app$/, /\.netlify\.app$/]
      : true,
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Connect to database
  const db = getDatabase();
  await db.connect();

  // Routes
  app.use('/api', routes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start server
  app.listen(config.port, () => {
    console.log('');
    console.log('🚀 ═══════════════════════════════════════════════════');
    console.log('   Punto de Encuentro API');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   🌐 Server:     http://localhost:${config.port}`);
    console.log(`   📚 API:        http://localhost:${config.port}/api`);
    console.log(`   💚 Health:     http://localhost:${config.port}/api/health`);
    console.log(`   🔧 Mode:       ${config.nodeEnv}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await db.disconnect();
    process.exit(0);
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
