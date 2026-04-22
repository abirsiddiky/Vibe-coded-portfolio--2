import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Request, Response, NextFunction } from 'express';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      } else if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key].map((item: any) => 
          typeof item === 'string' ? DOMPurify.sanitize(item) : item
        );
      }
    }
  }
  next();
};
