import { useState } from "react";
import styles from "./styles.module.css";

export default function Button({ index, onDropInto }) {
  const [active, setActive] = useState(false);
  const onDrop = () => {
    console.log("OnDROP");
    setActive(true);
    onDropInto();
  };

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const handleClick = () => {
    setActive(false);
  };

  return (
    <div className={styles.button} onDrop={onDrop} onDragOver={allowDrop}>
      {index}
      <input
        type="radio"
        checked={active}
        onChange={() => {}}
        onClick={handleClick}
      />
    </div>
  );
}
