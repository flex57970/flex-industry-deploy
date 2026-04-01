import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from './db';
import User, { IUser } from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function generateToken(id: string, role: string) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not set');
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
}

export async function getAuthUser(req: NextRequest): Promise<IUser | null> {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    if (!JWT_SECRET) return null;
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as { id: string };
    await connectDB();
    return await User.findById(decoded.id).select('-password');
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest): Promise<{ user: IUser } | Response> {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ message: 'Non autorisé' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ message: 'Accès réservé aux administrateurs' }, { status: 403 });
  return { user };
}
