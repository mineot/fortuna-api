// import { Home, ListPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useNavigator } from './navigator.hooks';

export function Navigator() {
  const { activation, t } = useNavigator();

  return (
    <div className="navigator">
      {/* <NavLink to="/" className={activation.home}>
        <Home size={16}></Home>
        <span>{t('app.navigator.home')}</span>
      </NavLink>
      <NavLink to="/registers" className={activation.registers}>
        <ListPlus size={16}></ListPlus>
        <span>{t('app.navigator.registers')}</span>
      </NavLink> */}
    </div>
  );
}
