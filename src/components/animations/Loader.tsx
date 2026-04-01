'use client';

export default function Loader() {
  return (
    <>
      <style>{`
        @keyframes loaderProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes loaderCount {
          0% { content: "0"; }
          10% { content: "10"; }
          20% { content: "20"; }
          30% { content: "30"; }
          40% { content: "40"; }
          50% { content: "50"; }
          60% { content: "60"; }
          70% { content: "70"; }
          80% { content: "80"; }
          90% { content: "90"; }
          100% { content: "100"; }
        }
        @keyframes loaderFadeOut {
          0%, 75% { opacity: 1; pointer-events: auto; }
          100% { opacity: 0; pointer-events: none; }
        }
        @keyframes loaderLogoReveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a0a0b;
          animation: loaderFadeOut 1.8s ease-out 1.1s forwards;
        }
        .loader-logo {
          opacity: 0;
          animation: loaderLogoReveal 0.6s ease-out 0.1s forwards;
        }
        .loader-counter::after {
          animation: loaderCount 1s ease-out forwards;
          content: "0";
        }
      `}</style>
      <div className="loader-overlay">
        <div className="loader-logo" style={{ marginBottom: 40 }}>
          <span style={{ fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'white' }}>
            <span style={{ fontWeight: 600 }}>Flex</span>
            <span style={{ color: '#b8956a' }}>.</span>
            <span style={{ fontWeight: 300 }}>industry</span>
          </span>
        </div>

        <div style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', borderRadius: 1 }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #b8956a, #d4b896)',
              borderRadius: 1,
              animation: 'loaderProgress 1s ease-out forwards',
            }}
          />
        </div>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span
            className="loader-counter"
            style={{ fontSize: 11, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}
          />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', fontWeight: 400 }}>%</span>
        </div>
      </div>
    </>
  );
}
