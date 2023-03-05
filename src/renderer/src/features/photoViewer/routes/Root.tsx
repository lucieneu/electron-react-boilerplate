import { Outlet, useLocation } from 'react-router-dom';

function Root({ children }: { children: any }) {
  const location = useLocation();
  console.log('logging root', children, location);
  return (
    <div>
      <Outlet />
    </div>
  );
}

export { Root };
