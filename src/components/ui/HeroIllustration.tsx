'use client';

interface HeroIllustrationProps {
  slug: string;
}

export default function HeroIllustration({ slug }: HeroIllustrationProps) {
  const illustrations: Record<string, React.ReactNode> = {
    home: (
      /* Cinematic / Play button + film reel */
      <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Film reel circle */}
        <circle cx="300" cy="300" r="220" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <circle cx="300" cy="300" r="180" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <circle cx="300" cy="300" r="260" stroke="currentColor" strokeWidth="0.5" opacity="0.08" strokeDasharray="8 12" />

        {/* Play triangle */}
        <path d="M260 200 L400 300 L260 400 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.2" fill="none" />
        <path d="M270 220 L380 300 L270 380 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="currentColor" fillOpacity="0.03" />

        {/* Film perforations */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={`perf-${i}`} x="60" y={120 + i * 52} width="16" height="24" rx="3" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={`perf2-${i}`} x="524" y={120 + i * 52} width="16" height="24" rx="3" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
        ))}

        {/* Cross lines */}
        <line x1="300" y1="60" x2="300" y2="540" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
        <line x1="60" y1="300" x2="540" y2="300" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />

        {/* Lens flare circles */}
        <circle cx="300" cy="300" r="40" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
        <circle cx="300" cy="300" r="8" fill="currentColor" opacity="0.06" />
      </svg>
    ),

    immobilier: (
      /* Building / Architecture */
      <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main building */}
        <rect x="180" y="140" width="240" height="360" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <rect x="200" y="160" width="200" height="340" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />

        {/* Windows grid */}
        {[0, 1, 2, 3, 4, 5].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`win-${row}-${col}`}
              x={220 + col * 65}
              y={180 + row * 50}
              width="35"
              height="28"
              rx="2"
              stroke="currentColor"
              strokeWidth="0.8"
              opacity="0.12"
            />
          ))
        )}

        {/* Door */}
        <rect x="270" y="430" width="60" height="70" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <path d="M270 430 Q300 410 330 430" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />

        {/* Side building left */}
        <rect x="100" y="240" width="80" height="260" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        {[0, 1, 2, 3].map((row) => (
          <rect key={`wl-${row}`} x="115" y={260 + row * 55} width="25" height="20" rx="1" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        ))}

        {/* Side building right */}
        <rect x="420" y="200" width="80" height="300" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        {[0, 1, 2, 3, 4].map((row) => (
          <rect key={`wr-${row}`} x="435" y={220 + row * 50} width="25" height="20" rx="1" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        ))}

        {/* Rooftop detail */}
        <path d="M180 140 L300 80 L420 140" stroke="currentColor" strokeWidth="0.8" opacity="0.12" fill="none" />

        {/* Ground line */}
        <line x1="60" y1="500" x2="540" y2="500" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />

        {/* Trees */}
        <circle cx="130" cy="475" r="18" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <line x1="130" y1="493" x2="130" y2="500" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <circle cx="470" cy="470" r="22" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <line x1="470" y1="492" x2="470" y2="500" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      </svg>
    ),

    automobile: (
      /* Car silhouette */
      <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Car body */}
        <path
          d="M100 340 L120 340 L150 280 L230 240 L370 240 L440 280 L480 340 L520 340 L520 380 L100 380 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.15"
          fill="currentColor"
          fillOpacity="0.02"
        />

        {/* Roof */}
        <path
          d="M200 240 L220 190 L380 190 L420 240"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.12"
          fill="none"
        />

        {/* Windshields */}
        <path d="M220 240 L235 195 L310 195 L310 240" stroke="currentColor" strokeWidth="0.6" opacity="0.1" fill="currentColor" fillOpacity="0.02" />
        <path d="M320 240 L320 195 L375 195 L395 240" stroke="currentColor" strokeWidth="0.6" opacity="0.1" fill="currentColor" fillOpacity="0.02" />

        {/* Wheels */}
        <circle cx="180" cy="380" r="40" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <circle cx="180" cy="380" r="28" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <circle cx="180" cy="380" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <circle cx="430" cy="380" r="40" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <circle cx="430" cy="380" r="28" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <circle cx="430" cy="380" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />

        {/* Wheel spokes */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={`spoke1-${angle}`}
            x1={180 + 10 * Math.cos((angle * Math.PI) / 180)}
            y1={380 + 10 * Math.sin((angle * Math.PI) / 180)}
            x2={180 + 28 * Math.cos((angle * Math.PI) / 180)}
            y2={380 + 28 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.08"
          />
        ))}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={`spoke2-${angle}`}
            x1={430 + 10 * Math.cos((angle * Math.PI) / 180)}
            y1={380 + 10 * Math.sin((angle * Math.PI) / 180)}
            x2={430 + 28 * Math.cos((angle * Math.PI) / 180)}
            y2={380 + 28 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.08"
          />
        ))}

        {/* Headlights */}
        <path d="M100 340 L80 335 L80 355 L100 360" stroke="currentColor" strokeWidth="0.8" opacity="0.12" fill="currentColor" fillOpacity="0.03" />
        <path d="M520 340 L540 335 L540 355 L520 360" stroke="currentColor" strokeWidth="0.8" opacity="0.12" fill="currentColor" fillOpacity="0.03" />

        {/* Light beams */}
        <path d="M80 340 L30 320 L30 370 L80 355" stroke="currentColor" strokeWidth="0.3" opacity="0.06" fill="currentColor" fillOpacity="0.01" />

        {/* Ground / Road */}
        <line x1="30" y1="420" x2="570" y2="420" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <line x1="30" y1="425" x2="570" y2="425" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />

        {/* Speed lines */}
        <line x1="30" y1="300" x2="80" y2="300" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <line x1="40" y1="320" x2="90" y2="320" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <line x1="50" y1="360" x2="85" y2="360" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />

        {/* Speedometer arc */}
        <path d="M300 120 A80 80 0 0 1 380 200" stroke="currentColor" strokeWidth="0.5" opacity="0.06" fill="none" />
        <path d="M300 130 A70 70 0 0 1 370 200" stroke="currentColor" strokeWidth="0.3" opacity="0.04" fill="none" />
        <line x1="300" y1="120" x2="355" y2="145" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      </svg>
    ),

    parfumerie: (
      /* Perfume bottle */
      <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Bottle body */}
        <path
          d="M220 230 L220 480 Q220 510 250 510 L350 510 Q380 510 380 480 L380 230"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.15"
          fill="currentColor"
          fillOpacity="0.02"
        />

        {/* Bottle neck */}
        <rect x="265" y="160" width="70" height="70" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.15" />

        {/* Cap */}
        <rect x="255" y="110" width="90" height="50" rx="8" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="currentColor" fillOpacity="0.02" />
        <rect x="275" y="95" width="50" height="20" rx="4" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />

        {/* Label */}
        <rect x="245" y="320" width="110" height="80" rx="4" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
        <line x1="260" y1="345" x2="340" y2="345" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <line x1="270" y1="360" x2="330" y2="360" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
        <line x1="275" y1="375" x2="325" y2="375" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />

        {/* Liquid level */}
        <path d="M222 300 Q300 285 378 300" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />

        {/* Spray mist */}
        <circle cx="300" cy="75" r="4" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <circle cx="285" cy="55" r="3" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
        <circle cx="315" cy="50" r="3.5" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
        <circle cx="295" cy="35" r="2.5" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
        <circle cx="310" cy="30" r="2" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
        <circle cx="275" cy="40" r="2" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
        <circle cx="325" cy="42" r="2" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />

        {/* Decorative flowers */}
        <circle cx="140" cy="350" r="20" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <circle cx="140" cy="350" r="8" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={`petal-${angle}`}
            cx={140 + 14 * Math.cos((angle * Math.PI) / 180)}
            cy={350 + 14 * Math.sin((angle * Math.PI) / 180)}
            rx="6"
            ry="10"
            transform={`rotate(${angle} ${140 + 14 * Math.cos((angle * Math.PI) / 180)} ${350 + 14 * Math.sin((angle * Math.PI) / 180)})`}
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.06"
          />
        ))}

        {/* Decorative flower right */}
        <circle cx="460" cy="280" r="16" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <circle cx="460" cy="280" r="6" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={`petal2-${angle}`}
            cx={460 + 11 * Math.cos((angle * Math.PI) / 180)}
            cy={280 + 11 * Math.sin((angle * Math.PI) / 180)}
            rx="5"
            ry="8"
            transform={`rotate(${angle} ${460 + 11 * Math.cos((angle * Math.PI) / 180)} ${280 + 11 * Math.sin((angle * Math.PI) / 180)})`}
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.06"
          />
        ))}

        {/* Reflection highlight */}
        <line x1="240" y1="250" x2="240" y2="450" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        <line x1="245" y1="260" x2="245" y2="440" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
      </svg>
    ),

    contact: (
      /* Envelope / message */
      <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Envelope body */}
        <rect x="100" y="180" width="400" height="280" rx="12" stroke="currentColor" strokeWidth="1.2" opacity="0.15" />
        <rect x="115" y="195" width="370" height="250" rx="8" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />

        {/* Envelope flap */}
        <path d="M100 180 L300 340 L500 180" stroke="currentColor" strokeWidth="1.2" opacity="0.15" fill="none" />
        <path d="M100 460 L250 320" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <path d="M500 460 L350 320" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />

        {/* @ symbol */}
        <circle cx="300" cy="300" r="35" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
        <circle cx="300" cy="300" r="18" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
        <path d="M318 300 A18 18 0 1 0 300 318 L318 318 L318 282" stroke="currentColor" strokeWidth="0.6" opacity="0.08" fill="none" />

        {/* Signal waves */}
        <path d="M460 120 A60 60 0 0 1 520 180" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />
        <path d="M470 130 A45 45 0 0 1 515 175" stroke="currentColor" strokeWidth="0.5" opacity="0.06" fill="none" />
        <path d="M480 140 A30 30 0 0 1 510 170" stroke="currentColor" strokeWidth="0.5" opacity="0.04" fill="none" />

        {/* Chat bubbles */}
        <rect x="80" y="80" width="100" height="60" rx="12" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <path d="M120 140 L110 155 L140 140" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />
        <line x1="100" y1="100" x2="160" y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
        <line x1="100" y1="115" x2="145" y2="115" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />

        {/* Paper plane */}
        <path d="M450 500 L530 470 L470 530 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="currentColor" fillOpacity="0.02" />
        <line x1="530" y1="470" x2="485" y2="505" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />

        {/* Dots decoration */}
        <circle cx="140" cy="500" r="3" fill="currentColor" opacity="0.06" />
        <circle cx="160" cy="510" r="2" fill="currentColor" opacity="0.04" />
        <circle cx="150" cy="520" r="2.5" fill="currentColor" opacity="0.05" />
      </svg>
    ),
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ color: '#c8a97e' }}>
      <div className="w-[70%] h-[70%] max-w-[500px] max-h-[500px] opacity-100">
        {illustrations[slug] || illustrations.home}
      </div>
    </div>
  );
}
