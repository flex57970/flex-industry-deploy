import type { LandingContent } from "@/lib/db/schema";

export function renderLandingHtml(
  name: string,
  content: LandingContent,
  opts: { removeBranding?: boolean; primaryColor?: string; accentColor?: string } = {},
): string {
  const { removeBranding = false, primaryColor = "#D4AF37", accentColor = "#0D0D0D" } = opts;
  const primaryAlpha = (alpha: number): string => {
    const hex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${primaryColor}${hex}`;
  };
  const esc = (s: string): string =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const hero = content.hero;
  const features = content.features
    .map(
      (f) => `
      <div class="card">
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.description)}</p>
      </div>`,
    )
    .join("\n");

  const faq = content.faq
    .map(
      (f) => `
      <details class="faq-item">
        <summary>${esc(f.question)}</summary>
        <p>${esc(f.answer)}</p>
      </details>`,
    )
    .join("\n");

  const pricing = (content.pricing ?? [])
    .map(
      (p) => `
      <div class="pricing-card ${p.highlighted ? "highlighted" : ""}">
        <h3>${esc(p.name)}</h3>
        <div class="price"><span>${esc(p.price)}</span><small>/ ${esc(p.interval)}</small></div>
        <ul>${p.features.map((f) => `<li>✓ ${esc(f)}</li>`).join("")}</ul>
      </div>`,
    )
    .join("\n");

  const branding = removeBranding
    ? ""
    : `<footer class="flex-branding">Made with ⚡ on <a href="https://flex-launch.com" target="_blank" rel="noopener">FLEX Launch</a></footer>`;

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(hero.title)} · ${esc(name)}</title>
  <meta name="description" content="${esc(hero.subtitle)}" />
  <style>
    :root{--primary:${primaryColor};--accent:${accentColor};--p10:${primaryAlpha(0.06)};--p20:${primaryAlpha(0.12)};--p30:${primaryAlpha(0.3)};--p50:${primaryAlpha(0.5)}}
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0D0D0D;color:#F5F5F0;line-height:1.6}
    .container{max-width:1120px;margin:0 auto;padding:0 24px}
    h1,h2,h3{font-family:Georgia,serif;letter-spacing:-0.02em}
    a{color:var(--primary);text-decoration:none}
    .hero{padding:96px 0;text-align:center;background:radial-gradient(ellipse at top,var(--p20),transparent 60%)}
    .eyebrow{display:inline-block;padding:4px 12px;border:1px solid var(--p30);border-radius:999px;color:var(--primary);font-size:13px;margin-bottom:24px}
    .hero h1{font-size:clamp(36px,5vw,64px);font-weight:700;line-height:1.1;max-width:800px;margin:0 auto}
    .hero p{font-size:18px;color:#C8C8BE;max-width:640px;margin:24px auto 0}
    .btn{display:inline-block;padding:12px 24px;border-radius:8px;font-weight:600;margin-top:32px;transition:transform .15s}
    .btn-primary{background:var(--primary);color:#0D0D0D;box-shadow:0 0 32px var(--p30)}
    .btn-secondary{border:1px solid #333;color:#F5F5F0;margin-left:8px}
    .btn:hover{transform:translateY(-1px)}
    section{padding:64px 0;border-top:1px solid #1E1E1E}
    section h2{font-size:36px;text-align:center;margin-bottom:48px}
    .grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
    .card{padding:24px;background:#121212;border:1px solid #222;border-radius:12px}
    .card h3{font-size:18px;margin-bottom:8px}
    .card p{color:#A0A098;font-size:14px}
    .pricing-card{padding:32px;background:#121212;border:1px solid #222;border-radius:12px}
    .pricing-card.highlighted{border-color:var(--p50);box-shadow:0 0 32px var(--p10)}
    .price{margin:16px 0 24px}
    .price span{font-size:40px;font-weight:700}
    .price small{color:#A0A098}
    .pricing-card ul{list-style:none}
    .pricing-card li{padding:6px 0;font-size:14px;color:#C8C8BE}
    .faq-item{background:#121212;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:12px}
    .faq-item summary{cursor:pointer;font-weight:600}
    .faq-item p{margin-top:12px;color:#A0A098;font-size:14px}
    .cta{text-align:center;background:linear-gradient(180deg,var(--p10),transparent);border:1px solid var(--p30);border-radius:16px;padding:64px 24px}
    .cta h2{margin-bottom:16px}
    .cta p{color:#C8C8BE;margin-bottom:8px}
    .flex-branding{text-align:center;padding:32px;color:#7A7A72;font-size:12px;border-top:1px solid #1E1E1E}
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      ${hero.eyebrow ? `<div class="eyebrow">${esc(hero.eyebrow)}</div>` : ""}
      <h1>${esc(hero.title)}</h1>
      <p>${esc(hero.subtitle)}</p>
      <div>
        <a class="btn btn-primary" href="#cta">${esc(hero.ctaPrimary)}</a>
        ${hero.ctaSecondary ? `<a class="btn btn-secondary" href="#features">${esc(hero.ctaSecondary)}</a>` : ""}
      </div>
    </div>
  </section>

  <section id="features">
    <div class="container">
      <h2>Ce que tu obtiens</h2>
      <div class="grid">${features}</div>
    </div>
  </section>

  ${
    pricing
      ? `<section id="pricing"><div class="container"><h2>Tarifs</h2><div class="grid">${pricing}</div></div></section>`
      : ""
  }

  <section id="faq">
    <div class="container" style="max-width:760px">
      <h2>Questions fréquentes</h2>
      ${faq}
    </div>
  </section>

  <section id="cta">
    <div class="container" style="max-width:760px">
      <div class="cta">
        <h2>${esc(content.cta.title)}</h2>
        <p>${esc(content.cta.subtitle)}</p>
        <a class="btn btn-primary" href="#">${esc(content.cta.button)}</a>
      </div>
    </div>
  </section>

  ${branding}
</body>
</html>`;
}
