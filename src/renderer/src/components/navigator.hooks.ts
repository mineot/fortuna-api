import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export function useNavigator() {
  const location = useLocation();
  const { t } = useTranslation();

  const checkActive = (isActive: boolean): string => (isActive ? 'item active' : 'item');

  const activation = useMemo(
    () => ({
      home: checkActive(location.pathname === '/'),
      registers: checkActive(location.pathname === '/registers'),
    }),
    [location.pathname],
  );

  return { activation, t };
}
