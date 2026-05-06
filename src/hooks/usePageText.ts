'use client';

import { useEffect, useState } from 'react';

interface PageTextEntry {
  _id: string;
  page: string;
  key: string;
  label: string;
  value: string;
  type: string;
  group: string;
  order: number;
}

/**
 * Fetch and cache all editable texts for a given page.
 * Returns a `t(key, fallback)` function that returns the text value or the fallback.
 *
 * Usage in a public page:
 *   const { t } = usePageText('contact');
 *   <h1>{t('hero.title', 'Contact')}</h1>
 */
export function usePageText(page: string) {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/page-texts/${page}`)
      .then((r) => r.json())
      .then((data: PageTextEntry[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          for (const item of data) {
            map[item.key] = item.value;
          }
          setTexts(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [page]);

  const t = (key: string, fallback: string = ''): string => {
    return texts[key] ?? fallback;
  };

  return { t, texts, loaded };
}
