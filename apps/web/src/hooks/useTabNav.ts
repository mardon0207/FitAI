import { useNavigate } from 'react-router-dom';

/** Shared helper — tab-bar handler that navigates between the main tabs. */
export function useTabNav() {
  const navigate = useNavigate();
  return (id: 'home' | 'diary' | 'add' | 'stats' | 'profile') => {
    const paths: Record<typeof id, string> = {
      home: '/',
      diary: '/diary',
      add: '/add',
      stats: '/stats',
      profile: '/profile',
    };
    navigate(paths[id]);
  };
}
