import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import Row from "./components/row";
import Button from "./components/button";
import Component from "./components/component";
import { useCallback, useState } from "react";

import styles from "./styles.module.css";

function App() {
  const CODE_EDITOR_ID = "code-editor";
  const InitialBoard = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  const [board, setBoard] = useState(InitialBoard);
  const [counter, setCounter] = useState(0);
  const [code, setCode] = useState("");

  const onItemDrop = useCallback(
    (rowIndex, columnIndex) => {
      const newCounter = counter + 1;
      setCounter(newCounter);
      const newBoard = board;
      newBoard[rowIndex][columnIndex] = newCounter;
      setBoard(newBoard);

      const items = newBoard
        .flat()
        .sort((a, b) => a - b)
        .filter(Boolean);
      let newCode = "";
      items.forEach((item) => {
        newCode += `Instrucción ${item} \n`;
      });
      setCode(newCode);
    },
    [board, counter]
  );

  return (
    <div className="App">
      <div className={styles["app-container"]}>
        <div>
          <Component />
          {board.map((row, rowIndex) => {
            return (
              <Row key={"row_" + rowIndex}>
                {row.map((column, columnIndex) => {
                  return (
                    <Button
                      key={"button_" + columnIndex}
                      index={board[rowIndex][columnIndex]}
                      onDropInto={() => onItemDrop(rowIndex, columnIndex)}
                    />
                  );
                })}
              </Row>
            );
          })}
        </div>

        <div>
          <AceEditor
            mode="javascript"
            theme="monokai"
            fontSize={18}
            value={code}
            name={CODE_EDITOR_ID}
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
