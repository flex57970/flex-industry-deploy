import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { autoSeed } from '@/lib/seed';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await autoSeed();
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ message: 'Email et mot de passe requis' }, { status: 400 });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return Response.json({ message: 'Email ou mot de passe incorrect' }, { status: 401 });
    }
    const token = generateToken(String(user._id), user.role);
    return Response.json({ user, token });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
