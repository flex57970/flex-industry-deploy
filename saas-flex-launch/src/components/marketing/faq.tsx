const FAQ_ITEMS = [
  {
    q: "Combien de temps pour générer ma première page ?",
    a: "Moins de 60 secondes. Tu décris ton produit en une phrase, l'IA produit le texte complet, tu édites ce que tu veux, tu publies.",
  },
  {
    q: "Je peux exporter le code ?",
    a: "Oui, HTML statique sur tous les plans, Next.js (pages exportables) sur Pro et Agency. Tes pages restent à toi.",
  },
  {
    q: "Je peux utiliser mon propre domaine ?",
    a: "Oui sur Pro (1 domaine) et Agency (domaines illimités). On te guide dans la config DNS, ça prend 5 min.",
  },
  {
    q: "Comment ça marche pour les agences ?",
    a: "Le plan Agency retire le branding FLEX, donne accès à l'API pour générer à la chaîne, et permet d'inviter 5 membres d'équipe. Parfait pour livrer des landing pages en série à tes clients.",
  },
  {
    q: "Et si j'annule ?",
    a: "Annulation en 1 clic depuis ton espace de facturation. Tu gardes l'accès jusqu'à la fin de la période payée. Aucun engagement.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-b border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">FAQ</h2>
          <p className="mt-4 text-muted-foreground">Les questions qu'on nous pose le plus.</p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border bg-card p-6 transition-colors open:border-flex-gold/40"
            >
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold list-none">
                {item.q}
                <span className="ml-4 text-flex-gold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
