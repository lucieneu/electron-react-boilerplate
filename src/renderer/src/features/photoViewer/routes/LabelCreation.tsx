import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'renderer/src/hooks/redux';
import { Label, selectCurrentList } from 'renderer/src/stores/labelSlice';
import LabelRow from '../components/label/LabelRow';

function LabelPage() {
  const navigate = useNavigate();

  const list = useAppSelector(selectCurrentList);

  const handleClick = () => {
    navigate('/photo-viewer');
  };

  return (
    <div>
      {list.map((label: Label) => (
        <LabelRow key={label.id} label={label} />
      ))}
      <LabelRow />
      <button type="button" onClick={handleClick}>
        Next
      </button>
    </div>
  );
}

function LabelCreation() {
  return <LabelPage />;
}

export { LabelCreation };
