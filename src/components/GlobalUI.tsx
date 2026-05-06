import { useLocation } from 'react-router-dom';
import AICoachFab from './AICoachFab';
import WelcomeOverlay from './WelcomeOverlay';

export default function GlobalUI() {
  const location = useLocation();
  const isHero = location.pathname === '/';

  if (isHero) return <WelcomeOverlay />;

  return (
    <>
      <AICoachFab />
      <WelcomeOverlay />
    </>
  );
}
