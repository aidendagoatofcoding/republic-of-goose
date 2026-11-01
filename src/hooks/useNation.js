import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { applyTheme, DEFAULT_THEME } from '@/lib/themes';
import { DEFAULT_ANNOUNCEMENT, DEFAULT_LAWS } from '@/lib/nationDefaults';

const FALLBACK_LAWS = DEFAULT_LAWS.map((law, index) => ({ ...law, id: `default-${index}` }));

export default function useNation() {
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);
  const [laws, setLaws] = useState(FALLBACK_LAWS);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [configPage, lawPage] = await Promise.all([
        base44.entities.NationConfig.list({ sort: '-created_date', limit: 1 }),
        base44.entities.Law.list({ sort: 'position', limit: 200 }),
      ]);

      const config = configPage?.items?.[0];
      if (config?.announcement) {
        const lines = config.announcement
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
        if (lines.length) setAnnouncement(lines);
      }
      if (config?.theme) setTheme(config.theme);
      if (lawPage?.items?.length) setLaws(lawPage.items);
    } catch {
      // Keep the published defaults on screen if the record can't be reached.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return { announcement, laws, theme, loading, reload };
}