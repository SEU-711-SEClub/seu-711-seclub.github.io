import { useEffect, useState } from 'react';

export interface UndergradToolLink {
  label: string;
  url: string;
}

export interface UndergradTool {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  links: UndergradToolLink[];
  platforms?: string[];
  pricing?: string;
  useCases?: string[];
  courseTags?: string[];
  pros: string[];
  cons: string[];
  ai?: {
    highlights?: string[];
  };
  alternatives?: string[];
}

export interface UndergradToolCategory {
  key: string;
  name: string;
  description?: string;
  courseTags?: string[];
  tools: UndergradTool[];
}

export interface UndergradToolsData {
  updatedAt: string;
  intro?: string;
  cautions?: string[];
  categories: UndergradToolCategory[];
}

export function useUndergradTools(enabled: boolean = true) {
  const [data, setData] = useState<UndergradToolsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/content/undergrad/tools/tools.json');
        if (!response.ok) {
          throw new Error('Failed to load undergrad tools');
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
  }, [enabled]);

  return { data, loading, error };
}

