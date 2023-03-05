import { Link } from 'react-router-dom';

function NotFound() {
  let a;
  console.log('logging 404');
  return (
    <div>
      404 missing page
      <Link to="/directory">go to </Link>
    </div>
  );
}
export { NotFound };
