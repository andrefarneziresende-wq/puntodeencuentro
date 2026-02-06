/**
 * Database Factory
 * 
 * Returns the appropriate database adapter based on configuration.
 * To add a new database:
 * 1. Create a new adapter implementing DatabaseAdapter
 * 2. Add a case here
 * 3. Update .env with DB_TYPE
 */

import { DatabaseAdapter } from './DatabaseAdapter.js';
import { SQLiteAdapter } from './SQLiteAdapter.js';
import { config } from '../config/index.js';

let database: DatabaseAdapter | null = null;

export function getDatabase(): DatabaseAdapter {
  if (!database) {
    switch (config.database.type) {
      case 'sqlite':
      default:
        database = new SQLiteAdapter();
        break;
      
      // Future implementations:
      // case 'postgresql':
      //   database = new PostgreSQLAdapter();
      //   break;
      // case 'mysql':
      //   database = new MySQLAdapter();
      //   break;
      // case 'mongodb':
      //   database = new MongoDBAdapter();
      //   break;
    }
  }
  
  return database;
}

export { DatabaseAdapter };
