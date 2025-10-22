import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}
interface tokenPayloadType extends JwtPayload {
  id?: Types.ObjectId;
}
export { AuthRequest, tokenPayloadType };
