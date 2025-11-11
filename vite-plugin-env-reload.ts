import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that triggers a full page reload when .env files change
 */
export function envReloadPlugin(): Plugin {
  let envFileTimestamps: Map<string, number> = new Map();
  
  return {
    name: 'env-reload',
    
    configureServer(server) {
      // Watch .env files explicitly
      const envFiles = ['.env.local', '.env', '.env.development'];
      
      envFiles.forEach(file => {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          server.watcher.add(filePath);
          envFileTimestamps.set(filePath, fs.statSync(filePath).mtimeMs);
        }
      });
      
      // Watch for file changes
      server.watcher.on('change', (file) => {
        if (file.endsWith('.env.local') || file.endsWith('.env') || file.endsWith('.env.development')) {
          const stats = fs.statSync(file);
          const lastModified = envFileTimestamps.get(file) || 0;
          
          if (stats.mtimeMs > lastModified) {
            envFileTimestamps.set(file, stats.mtimeMs);
            
            console.log('\n🔄 Environment variables changed - reloading browser...\n');
            
            // Force full page reload
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
          }
        }
      });
    }
  };
}
