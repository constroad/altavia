import { z } from 'zod';
import { withApi, withQueryValidation } from 'src/common/utils/middleware';
import { UserRepository } from 'src/repositories/userRepository';
import { json } from 'src/common/utils/response';
import { NextRequest } from 'next/server';
import { IUser, roles } from 'src/models/user';

const querySchema = z.object({
  role: z.enum(roles).optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

export async function POST(request: NextRequest) {
  return withApi(async () => {
    const data = await request.json();
    const created = await UserRepository.create(data);
    return json(created, 201);
  });
}

export async function GET(request: NextRequest) {
  return withApi(() =>
    withQueryValidation(querySchema, request, async ({ role, isActive }) => {
      const filter: Partial<Pick<IUser, 'role' | 'isActive'>> = {};

      if (role) filter.role = role;
      if (isActive) filter.isActive = isActive === 'true';

      const users = await UserRepository.findAll(filter);
      return json(users);
    })
  );
}
