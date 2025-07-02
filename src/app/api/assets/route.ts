// src/app/api/assets/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const assetsDir = path.join(process.cwd(), 'public/presentation');
  const files = fs.readdirSync(assetsDir);
  return NextResponse.json(files);
}
