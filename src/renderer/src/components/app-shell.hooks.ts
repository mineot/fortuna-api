import { appService } from '@services';
import type { GetMetaResponse } from '@shared/handlers/app/app.types';
import type { MenuItem } from '@widgets';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const INITIAL_META: GetMetaResponse = {
  name: 'App Shell',
  version: '...',
};

export function useAppShell() {
  const [meta, setMeta] = useState<GetMetaResponse>(INITIAL_META);
  const { t } = useTranslation();

  const menus: MenuItem[] = useMemo(
    () => [
      { key: 'home', label: t('pages.home.title'), to: '/', icon: 'house-fill' },
      { key: 'registers', label: t('pages.registers.title'), to: '/registers', icon: 'plus-circle-fill' },
    ],
    [t],
  );

  useEffect(() => {
    let isMounted = true;

    const loadMeta = async (): Promise<void> => {
      try {
        const data = await appService.getMeta();

        if (isMounted) {
          setMeta({
            name: data.name,
            version: data.version,
          });
        }
      } catch (error) {
        console.error('[useAppShell] Failed to load app meta', error);

        if (isMounted) {
          setMeta(INITIAL_META);
        }
      }
    };

    void loadMeta();

    return () => {
      isMounted = false;
    };
  }, []);

  return { meta, menus };
}
