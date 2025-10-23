import server, { startServer } from './src/server';
if (process.env.NODE_ENV !== 'production') {
  startServer();
}
export default server;
