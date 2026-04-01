import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-warm)] flex items-center justify-center px-5">
      <div className="text-center max-w-md animate-fade-in">
        <p className="text-[120px] md:text-[160px] font-light text-gray-200 leading-none tracking-tight">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 -mt-4">
          Page introuvable
        </h1>
        <p className="mt-4 text-gray-500 text-sm leading-relaxed">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-7 py-3.5 rounded-full hover:bg-gray-800 transition-all duration-300 font-medium"
          >
            Retour à l&apos;accueil
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-gray-600 text-sm px-7 py-3.5 rounded-full border border-gray-200 hover:bg-white transition-all duration-300 font-medium"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
