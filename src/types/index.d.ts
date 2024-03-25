// src/types/custom.d.ts

import { ROLE } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: { userId: string; role: ROLE };
  }
}
