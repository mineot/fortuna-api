import { useMenu } from './menu.hook';
import { type MenuProps, type MenuItem } from './menu.types';
import { NavLink } from 'react-router-dom';

function Menu(props: MenuProps) {
  const { checkActivation } = useMenu();

  return (
    <nav className="d-flex flex-column gap-2 px-1">
      {props.items.map((item) => (
        <NavLink key={item.key} to={item.to} className={({ isActive }) => checkActivation(isActive)}>
          <div className="d-flex gap-2 align-items-center justify-content-start">
            <i aria-hidden="true" className={`bi bi-${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
}

export { Menu, type MenuProps, type MenuItem };
