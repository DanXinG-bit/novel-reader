import { useState, useCallback } from 'react';

export function usePanel() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'characters' | 'stats'>('characters');

  const openPanel = useCallback((tab?: 'characters' | 'stats') => {
    if (tab) setActiveTab(tab);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  return { panelOpen, activeTab, setActiveTab, openPanel, closePanel };
}
