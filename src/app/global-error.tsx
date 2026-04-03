'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0b',
            color: 'white',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              <span style={{ fontWeight: 600 }}>Flex</span>
              <span style={{ color: '#b8956a' }}>.</span>
              <span style={{ fontWeight: 300 }}>industry</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>
            Une erreur est survenue
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', maxWidth: '400px' }}>
            Nous nous excusons pour la gêne occasionnée. Veuillez réessayer.
          </p>
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
        </div>
      </body>
    </html>
  );
}
