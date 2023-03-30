import { useState } from "react";
import styles from "./styles.module.css";

export default function Button() {
  const [active, setActive] = useState(false);
  const onDrop = () => {
    console.log("OnDROP");
    setActive(true);
  };

  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  return (
    <div className={styles.button} onDrop={onDrop} onDragOver={allowDrop}>
      <input type="radio" checked={active} onChange={() => {}} />
    </div>
  );
}
