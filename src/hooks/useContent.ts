import { useState, useEffect } from 'react';

export interface Announcement {
  title: string;
  date: string;
  type: string;
  excerpt: string;
  file: string;
  link?: string;
  location?: string;
  time?: string;
  participants?: string;
}

export interface Experience {
  title: string;
  author: string;
  year: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  file: string;
  link?: string;
}

export interface UndergradRequirement {
  title: string;
  author: string;
  year?: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  file: string;
}

export interface UndergradSummary {
  kpi: {
    key: string;
    label: string;
    current: number;
    target: number;
    unit?: string;
    comparison?: 'gte' | 'lte' | 'eq';
  }[];
  modules: {
    key: string;
    title: string;
    file: string;
    tags?: string[];
  }[];
}

export interface UndergradTimeline {
  axis: {
    categories: any;
    id: string;
    date: string;
    label: string;
    note?: string;
    link?: string;
  }[];
  intervals?: {
    categories: any;
    id: string;
    startId: string;
    endId: string;
    note?: string;
  }[];
  categories: {
    name: string;
    nodes: {
      axisId: string;
      title: string;
      detail: string;
      links?: { label: string; url: string }[];
      image?: { src: string; alt: string; width?: number; height?: number };
    }[];
    ranges?: {
      intervalId: string;
      title: string;
      detail: string;
      links?: { label: string; url: string }[];
      image?: { src: string; alt: string; width?: number; height?: number };
    }[];
  }[];
}

export interface ContentIndex {
  announcements: Announcement[]; // 保留向后兼容
  experiences: {
    categories: Record<string, Experience[]>;
    all: Experience[];
  };
  undergrad?: {
    requirements: UndergradRequirement[];
  };
  lastUpdated: string;
}

// Hook for loading content index
export function useContentIndex() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIndex = async () => {
      try {
        setLoading(true);
        const response = await fetch('/content/index.json');
        if (!response.ok) {
          throw new Error('Failed to load content index');
        }
        const data = await response.json();
        setIndex(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadIndex();
  }, []);

  return { index, loading, error };
}

// Hook for loading markdown content
export function useMarkdownContent(filePath: string) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/content/${filePath}`);
        if (!response.ok) {
          throw new Error(`Failed to load content: ${filePath}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      loadContent();
    }
  }, [filePath]);

  return { content, loading, error };
}

// Hook for loading undergrad requirement summary (KPI + module mapping)
export function useUndergradSummary() {
  const [data, setData] = useState<UndergradSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch('/content/undergrad/requirements/summary.json');
        if (!response.ok) {
          throw new Error('Failed to load undergrad summary');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading, error };
}

// Hook for loading undergrad project timeline data
export function useUndergradTimeline() {
  const [data, setData] = useState<UndergradTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch('/content/undergrad/projects/timeline.json');
        if (!response.ok) {
          throw new Error('Failed to load undergrad timeline');
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading, error };
}

// Helper function to get filtered experiences
export function getFilteredExperiences(
  experiences: Experience[],
  category: string
): Experience[] {
  if (category === '全部') {
    return experiences;
  }
  // 将"通知"映射到"announcements"分类
  const actualCategory = category === '通知' ? 'announcements' : category;
  return experiences.filter(exp => exp.category === actualCategory);
}

// Helper function to get latest announcements
export function getLatestAnnouncements(
  announcements: Announcement[],
  limit: number = 3
): Announcement[] {
  return announcements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
