import { motion } from 'framer-motion';
import { ReactElement, useEffect, useState } from 'react';
import { useAppDispatch } from 'renderer/src/hooks/redux';
import { Label, add, softDelete, update } from 'renderer/src/stores/labelSlice';
import { Pencil } from 'tabler-icons-react';
import './LabelRow.css';
import { Button } from '@mantine/core';

function ColorInput({
  hover,
  color,
  setColor,
}: {
  hover: boolean;
  color: string;
  setColor: Function;
}): ReactElement {
  return (
    <div className="color-input">
      <input
        value={color}
        type="color"
        onChange={(e) => {
          setColor(e.target.value);
        }}
      />
      <Pencil
        size={24}
        strokeWidth={1}
        color="white"
        style={{ opacity: hover ? 1 : 0 }}
      />
    </div>
  );
}

interface LabelRowProps {
  label?: Label;
}

function LabelRow({ label }: LabelRowProps): ReactElement {
  const isCreate = !label?.id;
  const isEdit = !!label?.id;
  const [color, setColor] = useState(label?.color ?? '#000000');
  const [name, setName] = useState(label?.name ?? '');
  const [keyPress, setKeyPress] = useState(label?.keyPress ?? '');
  const [hover, setHover] = useState(false);
  const hoverClass = hover || name.length === 0 ? 'hover' : '';
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (label) {
      setColor(label.color);
      setName(label.name);
      setKeyPress(label.keyPress);
    }
  }, [label]);

  const hasChanges =
    isEdit &&
    (label.color !== color ||
      label.name !== name ||
      label.keyPress !== keyPress);

  const disabled =
    !color || !name.length || !keyPress.length || (!hasChanges && isEdit);

  // TODO: Del
  console.log({ color, name, keyPress });

  const handleAdd = () => {
    if (isCreate) {
      dispatch(
        add({
          name,
          color,
          keyPress,
        })
      );

      setName('');
      setColor('#000000');
    }
  };

  const handleEdit = () => {
    if (isEdit)
      dispatch(
        update({
          ...label,
          name,
          color,
          keyPress,
        })
      );
  };

  const handleClick = () => {
    if (!disabled) {
      if (isCreate) {
        handleAdd();
      } else if (isEdit) {
        handleEdit();
      }
    }
  };

  const handleDelete = () => {
    if (label)
      dispatch(
        softDelete({
          id: label.id,
        })
      );
  };

  const handleKeyPress = (key: string) => {
    setKeyPress(key.length === 2 ? key[1] : key);
  };

  const createBtn = isCreate && (
    <Button disabled={disabled} onClick={handleClick} compact>
      Add
    </Button>
  );
  const editBtn = isEdit && hasChanges && (
    <Button disabled={disabled} onClick={handleClick} compact>
      Save
    </Button>
  );

  const deleteBtn = isEdit && hover && (
    <Button onClick={handleDelete} compact>
      Delete
    </Button>
  );

  return (
    <motion.div
      className={`label-row ${hoverClass}`}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onFocus={() => {
        setHover(true);
      }}
    >
      <ColorInput
        hover={hover || name.length === 0}
        color={color}
        setColor={setColor}
      />
      <input
        value={keyPress}
        className="keyPress"
        onChange={(e) => {
          handleKeyPress(e.target.value);
        }}
      />
      <input
        value={name}
        className="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      {createBtn}
      {deleteBtn}
      {editBtn}
    </motion.div>
  );
}
export default LabelRow;
