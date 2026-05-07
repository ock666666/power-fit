import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { to: '/home', label: '首页', emoji: '🏠' },
  { to: '/plan', label: '计划', emoji: '📋' },
  { to: '/ai', label: 'AI', emoji: '🤖' },
  { to: '/diet', label: '饮食', emoji: '🍽️' },
  { to: '/log', label: '记录', emoji: '📝' },
];

export default function BottomNav() {
  const location = useLocation();
  const { theme, setTheme } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-4xl">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/home'}
            className={({ isActive }) => {
              const active = isActive || (item.to === '/home' && location.pathname.startsWith('/training/'));
              return `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                active ? 'text-foreground' : 'text-foreground/40'
              }`;
            }}
          >
            <span className="text-lg">{item.emoji}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'warm' : 'dark')}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-xs text-foreground/40 hover:text-foreground transition-colors"
        >
          <span className="text-lg">{theme === 'dark' ? '🌙' : '🌸'}</span>
          <span>{theme === 'dark' ? '暗色' : '暖色'}</span>
        </button>
      </div>
    </nav>
  );
}
