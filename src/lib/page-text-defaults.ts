/**
 * Default values for editable page texts.
 * These are seeded on first request and represent the initial site copy.
 */

export interface PageTextDefault {
  page: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'html' | 'list';
  group: string;
  order: number;
}

export const PAGE_TEXT_DEFAULTS: PageTextDefault[] = [
  // ─────────── HOME ───────────
  { page: 'home', key: 'hero.eyebrow', label: 'Hero — étiquette', value: 'Agence de communication visuelle', type: 'text', group: 'Hero', order: 1 },
  { page: 'home', key: 'hero.title-line-1', label: 'Hero — ligne 1 (titre)', value: 'Nous créons', type: 'text', group: 'Hero', order: 2 },
  { page: 'home', key: 'hero.title-line-2', label: 'Hero — ligne 2 (mot fort)', value: "l'extraordinaire", type: 'text', group: 'Hero', order: 3 },
  { page: 'home', key: 'hero.subtitle', label: 'Hero — sous-titre', value: "Contenu cinématographique haut de gamme pour les marques qui refusent l'ordinaire.", type: 'textarea', group: 'Hero', order: 4 },
  { page: 'home', key: 'about.title-line-1', label: 'À propos — ligne 1', value: 'Une vision', type: 'text', group: 'À propos', order: 1 },
  { page: 'home', key: 'about.title-line-2', label: 'À propos — ligne 2', value: 'cinématographique', type: 'text', group: 'À propos', order: 2 },
  { page: 'home', key: 'about.description', label: 'À propos — description', value: "Flex.industry est une agence de communication visuelle premium. Nous créons du contenu cinématographique sur-mesure pour les marques qui exigent l'excellence. Notre approche allie créativité, technique et vision stratégique.", type: 'textarea', group: 'À propos', order: 3 },

  // ─────────── CONTACT ───────────
  { page: 'contact', key: 'hero.eyebrow', label: 'Hero — étiquette', value: 'Parlons de votre projet', type: 'text', group: 'Hero', order: 1 },
  { page: 'contact', key: 'hero.title', label: 'Hero — titre', value: 'Contact', type: 'text', group: 'Hero', order: 2 },
  { page: 'contact', key: 'hero.subtitle', label: 'Hero — sous-titre', value: 'Une idée, un projet, une question ? Nous sommes là pour vous accompagner.', type: 'textarea', group: 'Hero', order: 3 },
  { page: 'contact', key: 'info.title', label: 'Bloc info — titre', value: 'Discutons de votre vision', type: 'text', group: 'Informations', order: 1 },
  { page: 'contact', key: 'info.description', label: 'Bloc info — description', value: 'Chaque projet est unique. Partagez-nous votre vision et nous vous proposerons une approche sur-mesure.', type: 'textarea', group: 'Informations', order: 2 },
  { page: 'contact', key: 'info.email', label: 'Email de contact', value: 'contact@flex-industry.fr', type: 'text', group: 'Coordonnées', order: 1 },
  { page: 'contact', key: 'info.phone', label: 'Téléphone', value: '+33 6 50 98 65 76', type: 'text', group: 'Coordonnées', order: 2 },
  { page: 'contact', key: 'info.location', label: 'Localisation', value: 'Partout en France', type: 'text', group: 'Coordonnées', order: 3 },
  { page: 'contact', key: 'info.instagram', label: 'Instagram (@user)', value: '@studiot2.9', type: 'text', group: 'Coordonnées', order: 4 },
  { page: 'contact', key: 'info.instagram-url', label: 'Instagram (URL)', value: 'https://www.instagram.com/studiot2.9', type: 'text', group: 'Coordonnées', order: 5 },
  { page: 'contact', key: 'booking.eyebrow', label: 'Bloc RDV — étiquette', value: 'Rendez-vous', type: 'text', group: 'Réservation', order: 1 },
  { page: 'contact', key: 'booking.title', label: 'Bloc RDV — titre', value: 'Réservez un créneau', type: 'text', group: 'Réservation', order: 2 },
  { page: 'contact', key: 'booking.subtitle', label: 'Bloc RDV — sous-titre', value: 'Préférez un échange en direct ? Réservez un appel de 30 minutes pour discuter de votre projet.', type: 'textarea', group: 'Réservation', order: 3 },
  { page: 'contact', key: 'booking.cta-title', label: 'Bloc RDV — titre carte', value: 'Appel découverte — 30 min', type: 'text', group: 'Réservation', order: 4 },
  { page: 'contact', key: 'booking.cta-description', label: 'Bloc RDV — description carte', value: 'Discutons de votre projet, de vos objectifs et de comment Flex.industry peut vous accompagner. Sans engagement.', type: 'textarea', group: 'Réservation', order: 5 },
  { page: 'contact', key: 'booking.cta-url', label: 'Bloc RDV — URL Cal.com', value: 'https://cal.eu/lucas-guerder-basj80/30min', type: 'text', group: 'Réservation', order: 6 },
  { page: 'contact', key: 'booking.cta-label', label: 'Bloc RDV — texte bouton', value: 'Choisir un créneau', type: 'text', group: 'Réservation', order: 7 },
  { page: 'contact', key: 'reviews.eyebrow', label: 'Avis Google — étiquette', value: 'Avis clients', type: 'text', group: 'Avis Google', order: 1 },
  { page: 'contact', key: 'reviews.title', label: 'Avis Google — titre', value: 'Donnez-nous votre avis', type: 'text', group: 'Avis Google', order: 2 },
  { page: 'contact', key: 'reviews.subtitle', label: 'Avis Google — sous-titre', value: 'Votre avis compte. Partagez votre expérience sur Google pour aider d\'autres clients à nous découvrir.', type: 'textarea', group: 'Avis Google', order: 3 },
  { page: 'contact', key: 'reviews.url', label: 'Avis Google — URL (laissez vide pour cacher la section)', value: '', type: 'text', group: 'Avis Google', order: 4 },
  { page: 'contact', key: 'reviews.button', label: 'Avis Google — texte bouton', value: 'Laisser un avis Google', type: 'text', group: 'Avis Google', order: 5 },

  // ─────────── MENTIONS LÉGALES ───────────
  { page: 'mentions-legales', key: 'title', label: 'Titre principal', value: 'Mentions légales', type: 'text', group: 'En-tête', order: 1 },
  { page: 'mentions-legales', key: 'section1.title', label: '1. Titre', value: '1. Éditeur du site', type: 'text', group: 'Section 1', order: 1 },
  { page: 'mentions-legales', key: 'section1.content', label: '1. Contenu', value: 'Le site flex.industry est édité par Flex.industry, agence de communication visuelle.\n\nEmail : contact@flex-industry.fr\nTéléphone : +33 6 50 98 65 76', type: 'textarea', group: 'Section 1', order: 2 },
  { page: 'mentions-legales', key: 'section2.title', label: '2. Titre', value: '2. Hébergement', type: 'text', group: 'Section 2', order: 1 },
  { page: 'mentions-legales', key: 'section2.content', label: '2. Contenu', value: 'Le site est hébergé par Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Chypre.', type: 'textarea', group: 'Section 2', order: 2 },
  { page: 'mentions-legales', key: 'section3.title', label: '3. Titre', value: '3. Propriété intellectuelle', type: 'text', group: 'Section 3', order: 1 },
  { page: 'mentions-legales', key: 'section3.content', label: '3. Contenu', value: "L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est protégé par le droit d'auteur. Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site sans autorisation préalable est interdite.", type: 'textarea', group: 'Section 3', order: 2 },
  { page: 'mentions-legales', key: 'section4.title', label: '4. Titre', value: '4. Responsabilité', type: 'text', group: 'Section 4', order: 1 },
  { page: 'mentions-legales', key: 'section4.content', label: '4. Contenu', value: "Flex.industry s'efforce de fournir des informations exactes et à jour. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur ce site.", type: 'textarea', group: 'Section 4', order: 2 },
  { page: 'mentions-legales', key: 'section5.title', label: '5. Titre', value: '5. Contact', type: 'text', group: 'Section 5', order: 1 },
  { page: 'mentions-legales', key: 'section5.content', label: '5. Contenu', value: "Pour toute question relative aux mentions légales, vous pouvez nous contacter à l'adresse email : contact@flex-industry.fr", type: 'textarea', group: 'Section 5', order: 2 },

  // ─────────── CONFIDENTIALITÉ ───────────
  { page: 'confidentialite', key: 'title', label: 'Titre principal', value: 'Politique de confidentialité', type: 'text', group: 'En-tête', order: 1 },
  { page: 'confidentialite', key: 'section1.title', label: '1. Titre', value: '1. Collecte des données', type: 'text', group: 'Section 1', order: 1 },
  { page: 'confidentialite', key: 'section1.content', label: '1. Contenu', value: "Nous collectons les données que vous nous fournissez volontairement via nos formulaires : nom, prénom, email, numéro de téléphone, nom d'entreprise et message. Ces données sont nécessaires au traitement de votre demande.", type: 'textarea', group: 'Section 1', order: 2 },
  { page: 'confidentialite', key: 'section2.title', label: '2. Titre', value: '2. Utilisation des données', type: 'text', group: 'Section 2', order: 1 },
  { page: 'confidentialite', key: 'section2.content', label: '2. Contenu', value: 'Vos données personnelles sont utilisées uniquement pour :\n- Répondre à vos demandes de contact\n- Gérer votre compte utilisateur\n- Vous envoyer des communications relatives à nos services (avec votre consentement)', type: 'textarea', group: 'Section 2', order: 2 },
  { page: 'confidentialite', key: 'section3.title', label: '3. Titre', value: '3. Conservation des données', type: 'text', group: 'Section 3', order: 1 },
  { page: 'confidentialite', key: 'section3.content', label: '3. Contenu', value: 'Vos données sont conservées pendant la durée nécessaire au traitement de votre demande et pendant une durée maximale de 3 ans à compter de votre dernier contact.', type: 'textarea', group: 'Section 3', order: 2 },
  { page: 'confidentialite', key: 'section4.title', label: '4. Titre', value: '4. Partage des données', type: 'text', group: 'Section 4', order: 1 },
  { page: 'confidentialite', key: 'section4.content', label: '4. Contenu', value: "Vos données personnelles ne sont jamais vendues ni partagées avec des tiers à des fins commerciales. Elles peuvent être transmises à nos sous-traitants techniques (hébergement, envoi d'emails) dans le strict cadre de leur mission.", type: 'textarea', group: 'Section 4', order: 2 },
  { page: 'confidentialite', key: 'section5.title', label: '5. Titre', value: '5. Vos droits', type: 'text', group: 'Section 5', order: 1 },
  { page: 'confidentialite', key: 'section5.content', label: '5. Contenu', value: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à : contact@flex-industry.fr", type: 'textarea', group: 'Section 5', order: 2 },
  { page: 'confidentialite', key: 'section6.title', label: '6. Titre', value: '6. Cookies', type: 'text', group: 'Section 6', order: 1 },
  { page: 'confidentialite', key: 'section6.content', label: '6. Contenu', value: "Ce site utilise uniquement des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de tracking ou publicitaire n'est utilisé.", type: 'textarea', group: 'Section 6', order: 2 },
];

export const PAGE_LABELS: Record<string, string> = {
  home: 'Accueil',
  contact: 'Contact',
  'mentions-legales': 'Mentions légales',
  confidentialite: 'Confidentialité',
};
