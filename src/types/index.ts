import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}
interface tokenPayloadType extends JwtPayload {
  id?: string;
}
export { AuthRequest, tokenPayloadType };
