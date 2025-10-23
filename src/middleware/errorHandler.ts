import { NextFunction, Request, Response } from 'express';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    if (err instanceof Error) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  } catch (error) {
    return console.log(error);
  }
};

export default errorHandler;
