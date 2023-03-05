import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DirInput({ onSubmit }: { onSubmit: Function }) {
  const [state, setState] = useState(
    `D:/backup oneplus camera/archive-delete 2017-2018`
  );
  const navigate = useNavigate();
  const handleClick = () => {
    onSubmit(state);
    navigate('/photo-viewer');
  };

  useEffect(() => {
    handleClick();
  }, []);
  return (
    <div>
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <button type="button" onClick={handleClick}>
        Click.
      </button>
    </div>
  );
}

function SelectDir() {
  const handleFetchDirectory = (dir = '') => {
    console.log('start');
    // false
    //   ? `C:/Users/Lucien/Pictures/CV`
    //   : `D:/backup oneplus camera/archive-delete 2017-2018`;

    const res = window.electronStore.directory.fetch(dir);
    console.log('end', res);
    // console.log(
    //   window.electronStore.directory.getStats(
    //     `C:/Users/Lucien/Pictures/CV`
    //   )
    // );
  };
  return <DirInput onSubmit={handleFetchDirectory} />;
}

export { SelectDir };
