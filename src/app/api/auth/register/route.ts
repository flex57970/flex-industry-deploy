import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { autoSeed } from '@/lib/seed';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await autoSeed();
    const { firstName, lastName, email, password } = await req.json();
    if (!firstName || !lastName || !email || !password) {
      return Response.json({ message: 'Tous les champs sont requis' }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ message: 'Mot de passe: 8 caractères minimum' }, { status: 400 });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ message: 'Cet email est déjà utilisé' }, { status: 400 });
    }
    const user = await User.create({ firstName, lastName, email, password });
    const token = generateToken(String(user._id), user.role);
    return Response.json({ user, token }, { status: 201 });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
