'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1rem', color: '#333' }}>
        Une erreur est survenue
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '2rem' }}>
        Veuillez réessayer ou revenir à l&apos;accueil.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          style={{
            background: '#b8956a',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Réessayer
        </button>
        <button
          onClick={() => { window.location.href = '/'; }}
          style={{
            background: 'transparent',
            color: '#333',
            border: '1px solid #ddd',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Accueil
        </button>
      </div>
    </div>
  );
}
