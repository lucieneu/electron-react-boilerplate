import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useKeyPress } from 'renderer/src/hooks/utils';
import { useEffect } from 'react';

function Root({ children }: { children: any }) {
  const location = useLocation();
  console.log('logging root', children, location);
  const navigate = useNavigate();
  const resetPressed = useKeyPress('r');
  useEffect(() => {
    if (resetPressed) navigate('/asdasd');
  }, [resetPressed]);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export { Root };
