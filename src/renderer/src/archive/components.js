// used for selecting a directory
function SelectDir() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.webkitdirectory = true;

    inputRef.current.directory = true;
  }, []);
  return (
    <input
      ref={inputRef}
      type="file"
      onChange={(e) => {
        console.log(URL.createObjectURL(e.target.files));
        setSearchDir(e.target.files);
      }}
      webkitdirectory
      webkitEntries
      webkitentries
      multiple
    />
  );
}

//  <button
//         type="button"
//         onClick={() => {
//           window.electronStore.store.set('foo', 'bar');

//           console.log(
//             window.electronStore.directory.getStats(
//               `C:/Users/Lucien/Pictures/CV`
//             )
//           );
//         }}
//       >
//         GET.
//       </button>
//       <button type="button" onClick={handleFetchDirectory}>
//         FETCH.
//       </button>
