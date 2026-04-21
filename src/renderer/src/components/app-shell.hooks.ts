import type { GetMetaResponse } from '@shared/handlers/app.types';
import { useEffect, useState } from 'react';

import { appService } from '../services/app.service';

export function useAppShell() {
  const [meta, setMeta] = useState<GetMetaResponse>({ name: '', version: '' });

  useEffect(() => {
    void appService.getMeta().then(setMeta);
  }, []);

  return { meta };
}
