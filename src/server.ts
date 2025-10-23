import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Types } from 'mongoose';
import { Server } from 'socket.io';
import connectDB from './database';
import errorHandler from './middleware/errorHandler';
import { messageRoutes, userRoutes } from './routes';

// Create Express App
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
await connectDB();

// Create Express & Socket.io Server
export const clientsMap = new Map<string, string>();
export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
io.on('connection', socket => {
  const userId = socket.handshake.query.userId;
  console.log(`User: ${userId} is connecting...`);
  if (
    userId &&
    typeof userId === 'string' &&
    !clientsMap.get(userId) &&
    Types.ObjectId.isValid(userId)
  )
    clientsMap.set(userId, socket.id);
  io.emit('onlineUsers', Array.from(clientsMap.keys()));
  io.on('disconnect', () => {
    console.log(`User: ${userId} is disconnecting...`);
    if (userId && typeof userId === 'string' && Types.ObjectId.isValid(userId))
      clientsMap.delete(userId);
    io.emit('onlineUsers', Array.from(clientsMap.keys()));
  });
});
// Middleware setup
app.use(cors());
app.use(express.json({ limit: '4mb' }));

// Routes
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, req.originalUrl, req.body);
  next();
});
app.use('/api/status', (req: Request, res: Response) => {
  res.send('Server is up and running');
});
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);
app.use(errorHandler);

// Server Setup
const PORT = process.env.PORT || 5000;

export const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

export default server;
