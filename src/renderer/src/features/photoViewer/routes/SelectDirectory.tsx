import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'renderer/src/hooks/redux';
import { selectPath, update } from 'renderer/src/stores/directorySlice';

function DirectoryPage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/label-creation');
  };
  const path = useAppSelector(selectPath);
  const dispatch = useAppDispatch();

  return (
    <div>
      <input
        type="text"
        value={path}
        onChange={(e) => dispatch(update(e.target.value))}
      />
      <button type="button" onClick={handleClick}>
        Click.
      </button>
    </div>
  );
}

function SelectDirectory() {
  return <DirectoryPage />;
}

export { SelectDirectory };
