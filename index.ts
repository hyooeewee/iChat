import server, { startServer } from './src/server';

if (process.env['NODE_ENV'] !== 'production') {
  startServer();
}
process.on('SIGINT', async () => {
  console.log('[Server] Shutting down...');
  process.exit(0);
});

export default server;
