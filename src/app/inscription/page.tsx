'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight } from 'lucide-react';

export default function InscriptionPage() {
  const router = useRouter();
  const { register, loading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);

    try {
      await register({ firstName, lastName, email, password });
      router.push('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 outline-none rounded-xl px-4 py-3.5 text-gray-900 placeholder:text-gray-300 text-sm transition-all duration-200";

  return (
    <div className="min-h-screen bg-[var(--color-warm)] flex items-center justify-center px-5 py-20">
      <div className="w-full max-w-[420px] animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-10">
            <span className="text-xl tracking-tight">
              <span className="font-semibold">Flex</span>
              <span className="text-[var(--color-accent)]">.</span>
              <span className="font-light">industry</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Créer un compte
          </h1>
          <p className="mt-3 text-gray-400 text-sm">
            Rejoignez l&apos;univers Flex.industry
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30 p-9">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-[11px] tracking-[0.1em] uppercase text-gray-500 mb-2 font-semibold">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-[11px] tracking-[0.1em] uppercase text-gray-500 mb-2 font-semibold">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[11px] tracking-[0.1em] uppercase text-gray-500 mb-2 font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] tracking-[0.1em] uppercase text-gray-500 mb-2 font-semibold">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] tracking-[0.1em] uppercase text-gray-500 mb-2 font-semibold">
                Confirmer
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-50 hover:bg-gray-800 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Déjà un compte ?{' '}
          <Link
            href="/connexion"
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] font-medium transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
