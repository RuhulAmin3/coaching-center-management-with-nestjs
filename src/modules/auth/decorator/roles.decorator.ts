import { SetMetadata } from '@nestjs/common';
import { ROLE } from '@prisma/client';
import { Roles } from '../auth.constant';

export const HasRoles = (...roles: ROLE[]) => SetMetadata(Roles, roles);
