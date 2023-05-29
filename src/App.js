import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import Row from "./components/row";
import Button from "./components/button";
import { useCallback, useState } from "react";
import { FiCopy, FiEdit3, FiMove } from "react-icons/fi";

import styles from "./styles.module.css";

function App() {
  const CODE_EDITOR_ID = "code-editor";
  const InitialBoard = [
    [null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null],
    [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null],
    [null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null],
  ];
  const [board, setBoard] = useState(InitialBoard);
  const [code, setCode] = useState("");

  const getBaseCode = (instructions) => {
    const baseCode = `
      #include <Stepper.h>
      #include <VarSpeedServo.h> 
      
      VarSpeedServo myservo1;  
      VarSpeedServo myservo2;
      
      const int stepsPerRevolution = 500;  
      
      Stepper myStepper1(stepsPerRevolution, 8, 9, 10, 11);
      Stepper myStepper2(stepsPerRevolution, 2, 3, 4, 5);

      bool executed = false;
      
      void setup(){
        myservo1.attach(6);  
        myservo2.attach(7);
      
        myStepper1.setSpeed(60);
        myStepper2.setSpeed(60);
      
        Serial.begin(9600);
      }
      
      void loop() {
        if (!executed) {
            ${instructions}
            executed = true;
        }
      }`;

    return baseCode;
  };

  const onItemDrop = useCallback(
    (rowIndex, columnIndex) => {
      const newBoard = board;
      const oldValue = newBoard[rowIndex][columnIndex];
      newBoard[rowIndex][columnIndex] = oldValue === 0 ? "activo" : 0;
      setBoard(newBoard);

      const points = [];
      newBoard.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          if (column === "activo") {
            points.push({ rowIndex, columnIndex });
          }
        });
      });

      let instructions = "";
      const moveServoInstructions = ({ rowIndex, columnIndex }, direction) => {
        let servoInstructions = "";
        const sign = direction === "+" ? "" : "-";
        const numStepsY = rowIndex * 1666;
        servoInstructions += `
            myStepper1.step(${sign}${numStepsY});
            delay(500);\n`;

        const numStepsX = columnIndex * 2453;
        servoInstructions += `
            myStepper2.step(${sign}${numStepsX});
            delay(500);\n`;
        return servoInstructions;
      };
      points.forEach((point) => {
        instructions += `
            // Ir al punto numero: ${point.rowIndex}, ${point.columnIndex}`;
        instructions += moveServoInstructions(point, "-");
        instructions += `
            // Soldar
            myservo2.write(90, 30, true); 
            myservo1.write(90, 30, true); 
            delay(1);
            myservo2.write(150, 30, true);
            myservo1.write(180, 30, true); 

            delay(6000);
            myservo1.write(90, 30, true); 
            myservo2.write(90, 30, true); \n`;
        instructions += `
            // Regresar a punto de partida`;
        instructions += moveServoInstructions(point, "+");
      });

      const newCode = getBaseCode(instructions);
      setCode(instructions !== "" ? newCode : "");
    },
    [board]
  );

  const calibrate = () => {
    const instructions = `
            myStepper2.step(-300);
            delay(500);\n`;
    const newCode = getBaseCode(instructions);
    setCode(newCode);
  };

  const adjustSolder = () => {
    const instructions = `
            myservo1.write(90, 30, true); 
            delay(1);
            myservo1.write(180, 30, true); 
            delay(1000);\n`;
    const newCode = getBaseCode(instructions);
    setCode(newCode);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="App">
      <div className={styles["app-container"]}>
        <section>
          <div className={styles["board-container"]}>
            <div>
              <img src="./logo ITESA.png" alt="ITESA" width={200} />
            </div>

            <div>
              {board.map((row, rowIndex) => {
                return (
                  <Row key={"row_" + rowIndex}>
                    {row.map((column, columnIndex) => {
                      return (
                        <Button
                          key={"button_" + columnIndex}
                          index={board[rowIndex][columnIndex]}
                          onClick={() => onItemDrop(rowIndex, columnIndex)}
                        />
                      );
                    })}
                  </Row>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <div className={styles["copy-code"]}>
            <button type="button" onClick={() => calibrate()}>
              <FiMove />
              Calibrar
            </button>
            <button type="button" onClick={() => adjustSolder()}>
              <FiEdit3 />
              Ajustar soldadura
            </button>
            <button type="button" onClick={() => copyCode()}>
              <FiCopy />
              Copiar código
            </button>
          </div>

          <AceEditor
            className={styles["code-editor"]}
            mode="javascript"
            theme="monokai"
            fontSize={18}
            value={code}
            name={CODE_EDITOR_ID}
            editorProps={{ $blockScrolling: true }}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
