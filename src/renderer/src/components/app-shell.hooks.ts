import { appService } from '@services';
import type { GetMetaResponse } from '@shared/handlers/app/app.types';
import { useEffect, useState } from 'react';

const INITIAL_META: GetMetaResponse = {
  name: 'App Shell',
  version: '...',
};

export function useAppShell() {
  const [meta, setMeta] = useState<GetMetaResponse>(INITIAL_META);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadMeta = async (): Promise<void> => {
      try {
        const data = await appService.getMeta();

        if (!signal.aborted) {
          setMeta({
            name: data.name,
            version: data.version,
          });
        }
      } catch (error) {
        console.error('[useAppShell] Failed to load app meta', error);

        if (!signal.aborted) {
          setMeta(INITIAL_META);
        }
      }
    };

    void loadMeta();

    return () => {
      controller.abort();
    };
  }, []);

  return { meta };
}
