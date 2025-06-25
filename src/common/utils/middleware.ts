import { connectToMongoDB } from "src/config/mongoose";

import { ZodSchema } from 'zod';
import { NextRequest } from 'next/server';

export function withBodyValidation<T>(
  schema: ZodSchema<T>,
  request: NextRequest,
  handler: (data: T) => Promise<Response>
): Promise<Response> {
  return request
    .json()
    .then((body) => {
      const result = schema.safeParse(body);
      if (!result.success) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed',
            details: result.error.format(),
          }),
          { status: 400 }
        );
      }
      return handler(result.data);
    })
    .catch((err) => {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON', details: err.message }),
        { status: 400 }
      );
    });
}

export async function withDb<T>(handler: () => Promise<T>): Promise<T> {
  await connectToMongoDB();

  return handler();
}

export function withTimeTracker<T>(handler: () => Promise<T>): Promise<T> {
  const start = Date.now();
  return handler().then((result) => {
    const elapsed = Date.now() - start;
    console.log(`[⏱️] API took ${elapsed}ms`);
    return result;
  });
}

export function withErrorHandler<T extends Response>(
  handler: () => Promise<T>
): Promise<Response> {
  return handler().catch((err) => {
    console.error(`[❌] API error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  });
}

// Middleware para validar query/searchParams (GET)
export function withQueryValidation<T>(
  schema: ZodSchema<T>,
  request: NextRequest,
  handler: (data: T) => Promise<Response>
): Promise<Response> {
  const url = new URL(request.url);
  const rawParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    rawParams[ key ] = value;
  });

  const result = schema.safeParse(rawParams);
  if (!result.success) {
    return Promise.resolve(
      new Response(JSON.stringify({ error: 'Invalid query', details: result.error.format() }), {
        status: 400,
      })
    );
  }

  return handler(result.data);
}

export function getQueryParameters(request: NextRequest) {
  const url = new URL(request.url);
  const rawParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    rawParams[ key ] = value;
  });
  return rawParams
}

// Middleware para validar params de rutas dinámicas (e.g. `[id]`)
export function withParamsValidation<T>(
  schema: ZodSchema<T>,
  params: Record<string, string>,
  handler: (validated: T) => Promise<Response>
): Promise<Response> {
  const result = schema.safeParse(params);
  if (!result.success) {
    return Promise.resolve(
      new Response(JSON.stringify({ error: 'Invalid route param', details: result.error.format() }), {
        status: 400,
      })
    );
  }

  return handler(result.data);
}

export function withApi(handler: () => Promise<Response>) {
  return withErrorHandler(() => withTimeTracker(() => withDb(handler)));
}


// Con esto ya tienes:

// Validación	        Middleware usado	       Método
// JSON Body	        withBodyValidation()	       POST / PUT
// Query params	      withQueryValidation()	   GET
// Route params	      withParamsValidation()	 GET / PUT / DELETE en [id]