'use client';

import { usePageText } from '@/hooks/usePageText';

export default function ConfidentialitePage() {
  const { t } = usePageText('confidentialite');

  const sections = [1, 2, 3, 4, 5, 6];

  return (
    <div className="min-h-screen bg-white pt-40 pb-24">
      <div className="max-w-[800px] mx-auto container-px">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-12">
          {t('title', 'Politique de confidentialité')}
        </h1>

        <div className="space-y-10 text-[15px] text-gray-600 leading-relaxed">
          {sections.map((n) => {
            const title = t(`section${n}.title`, '');
            const content = t(`section${n}.content`, '');
            if (!title && !content) return null;
            return (
              <section key={n}>
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
                )}
                {content && (
                  <p className="whitespace-pre-line">{content}</p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
