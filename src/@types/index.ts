import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import type { IUserDocument } from '../models/User';

interface AuthRequest extends Request {
  user?: IUserDocument;
}
interface tokenPayloadType extends JwtPayload {
  id?: Types.ObjectId;
}
export { AuthRequest, tokenPayloadType };
