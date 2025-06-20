import { z } from 'zod';
import { withApi, withParamsValidation } from 'src/common/utils/middleware';
import { UserRepository } from 'src/repositories/userRepository';
import { json } from 'src/common/utils/response';
import { NextRequest } from 'next/server';
import { userSchemaValidation } from 'src/models/user';

const paramSchema = z.object({
  id: z.string().length(24, 'ID inválido'),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop() ?? '';
  const result = paramSchema.safeParse({ id });
  if (!result.success) {
    return json({ error: 'Invalid route param', details: result.error.format() }, 400);
  }
  return withApi(async () => {
    const user = await UserRepository.findById(result.data.id);
    return json(user ?? { message: 'Usuario no encontrado' }, user ? 200 : 404);
  });
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop() ?? '';
  const result = paramSchema.safeParse({ id });
  if (!result.success) {
    return json({ error: 'Invalid route param', details: result.error.format() }, 400);
  }
  return withApi(async () => {
    const data = await req.json();
    const parsed = userSchemaValidation.safeParse(data);
    if (!parsed.success) {
      return json({ error: 'Datos inválidos', details: parsed.error.format() }, 400);
    }
    const { createdAt, updatedAt, ...userData } = parsed.data;
    const updated = await UserRepository.updateById(result.data.id, userData);
    return json(updated ?? { message: 'Usuario no encontrado' }, updated ? 200 : 404);
  });
}


export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop() ?? '';
  const result = paramSchema.safeParse({ id });
  if (!result.success) {
    return json({ error: 'Invalid route param', details: result.error.format() }, 400);
  }
  return withApi(async () => {
    const deleted = await UserRepository.deleteById(result.data.id);
    if (!deleted) return json({ message: 'Usuario no encontrado' }, 404);
    return json({ message: 'Usuario eliminado exitosamente' });
  });
}

