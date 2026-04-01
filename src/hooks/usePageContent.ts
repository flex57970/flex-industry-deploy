'use client';

import { useState, useEffect } from 'react';
import { contentAPI } from '@/lib/api';

interface ContentItem {
  _id: string;
  section: string;
  page: string;
  title: string;
  subtitle: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  order: number;
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function usePageContent(page: string) {
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    contentAPI
      .getByPage(page)
      .then((data) => setContent(data as ContentItem[]))
      .catch(() => {});
  }, [page]);

  const getSection = (section: string): ContentItem | undefined => {
    return content.find((c) => c.section === section);
  };

  const getMediaUrl = (section: string): string | null => {
    const item = getSection(section);
    if (!item?.mediaUrl) return null;
    return `${API_URL}${item.mediaUrl}`;
  };

  const getMediaType = (section: string): 'image' | 'video' | null => {
    const item = getSection(section);
    if (!item?.mediaUrl) return null;
    return item.mediaType;
  };

  return { content, getSection, getMediaUrl, getMediaType };
}
