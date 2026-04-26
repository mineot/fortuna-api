import type { GetMetaResponse } from '@shared/handlers/app.types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { appService } from '../services/app.service';

export function useAppShell() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const [meta, setMeta] = useState<GetMetaResponse>({ name: '', version: '' });
  const [pathName, setPathName] = useState<string>('');

  useEffect(() => {
    void appService.getMeta().then(setMeta);

    if (pathname === '/') {
      setPathName(t('app.navigator.home'));
    }
  }, []);

  return { meta, pathName };
}
