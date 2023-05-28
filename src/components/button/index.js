import { useState } from "react";
import styles from "./styles.module.css";

export default function Button({ index, onClick }) {
  const [active, setActive] = useState(false);
  const onDrop = () => {
    console.log("OnDROP");
    setActive(true);
    // onDropInto();
  };

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  const handleClick = () => {
    onClick();
    setActive((isActive) => !isActive);
  };

  return (
    <div className={styles.button} onDrop={onDrop} onDragOver={allowDrop}>
      {/* {index} */}
      {(() => {
        if (index !== null) {
          return (
            <input
              type="radio"
              checked={active}
              onChange={() => {}}
              onClick={handleClick}
            />
          );
        }
      })()}
    </div>
  );
}
