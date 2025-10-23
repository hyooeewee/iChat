import cors from 'cors';
import 'dotenv/config';
import express, { Application, NextFunction, Request, Response } from 'express';
import http from 'http';
import { Types } from 'mongoose';
import { Server } from 'socket.io';
import connectDB from './database/mongodb';
import errorHandler from './middleware/errorHandler';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';

// Create Express App
const app: Application = express();
const server = http.createServer(app);

// Create Express & Socket.io Server
export const clientsMap = new Map<string, string>();
export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
io.on('connection', socket => {
  const userId = socket.handshake.query['userId'];
  console.log(`[socket.io] User: ${userId} is connecting...`);
  if (
    userId &&
    typeof userId === 'string' &&
    !clientsMap.get(userId) &&
    Types.ObjectId.isValid(userId)
  )
    clientsMap.set(userId, socket.id);
  io.emit('onlineUsers', Array.from(clientsMap.keys()));
  console.log('User pairs:', Object.fromEntries(clientsMap));

  socket.on('disconnect', () => {
    console.log(`User: ${userId} is disconnecting...`);
    if (userId && typeof userId === 'string' && Types.ObjectId.isValid(userId))
      clientsMap.delete(userId);
    io.emit('onlineUsers', Array.from(clientsMap.keys()));
    console.log('User pairs:', Object.fromEntries(clientsMap));
  });
});

let isDbConnected = false;
// Middleware setup
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!isDbConnected) {
    console.log('[Database] Connecting to MongoDB...');
    connectDB().then(() => (isDbConnected = true));
  }
  return next();
});
app.use(cors());
app.use(express.json({ limit: '4mb' }));

// Routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use('/api/status', (_req: Request, res: Response) => {
  res.send('Server is up and running');
});
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);
app.use(errorHandler);

// Server Setup
const PORT = process.env['PORT'] || 5000;
const startServer = async () => {
  // Connect to MongoDB
  connectDB().then(() => (isDbConnected = true));
  server.listen(PORT, () => {
    console.log(`[Server] Server is running on http://localhost:${PORT}`);
  });
};

export default server;
export { startServer };
