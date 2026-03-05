import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Reads validation errors set by express-validator rules in routes
// If any errors exist, responds with 400 and lists all issues
// Otherwise passes the request through to the controller
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      })),
    });
    return;
  }

  next();
};
