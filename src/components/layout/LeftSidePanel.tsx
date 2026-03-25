// LeftNavbar.tsx (Updated)
import React from 'react';
import styles from './LeftNavbar.module.css';

interface NavItem {
  name: string;
  id: string;
  icon: React.ReactNode;
}


interface LeftNavbarProps {
  navItems: NavItem[];
  onChange: (id: string) => void;
  selectedId?: string;
}

const LeftNavbar: React.FC<LeftNavbarProps> = ({ navItems, onChange, selectedId }) => (
  <nav className={styles.navbar}>
    {navItems.map((item) => (
        <NavButton key={item.id} icon={item.icon} onClick={() => onChange(item.id)} title={item.name} isSelected={item.id === selectedId} />
    ))}
  </nav>
);

function NavButton({ icon, onClick, title, isSelected }: { icon: React.ReactNode; onClick: () => void; title: string; isSelected: boolean }) {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${isSelected ? styles.selected : ''} ${styles.button}`}
        >
            {icon}
            {isHovered && <div className={styles.tooltip}>{title}</div>}
        </button>
    );
}


export { LeftNavbar };
