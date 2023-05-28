import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import Row from "./components/row";
import Button from "./components/button";
import { useCallback, useState } from "react";

import styles from "./styles.module.css";

function App() {
  const CODE_EDITOR_ID = "code-editor";
  const InitialBoard = [
    [null, null, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null, null],
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
        const numStepsY = rowIndex * 2;
        for (let step = 0; step < numStepsY; step++) {
          servoInstructions += `
            myStepper1.step(${sign}stepsPerRevolution);
            delay(500);
            myStepper1.step(${sign}stepsPerRevolution);
            delay(500);
            myStepper1.step(${sign}stepsPerRevolution);
            delay(500);
            myStepper1.step(${sign}stepsPerRevolution);
            delay(500);\n`;
        }

        const numStepsX = columnIndex * 2;
        for (let step = 0; step < numStepsX; step++) {
          servoInstructions += `
            myStepper2.step(${sign}stepsPerRevolution);
            delay(500);
            myStepper2.step(${sign}stepsPerRevolution);
            delay(500);
            myStepper2.step(${sign}stepsPerRevolution);
            delay(500);
            myStepper2.step(${sign}stepsPerRevolution);
            delay(500);\n`;
        }
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

      const newCode = `
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

      setCode(instructions !== "" ? newCode : "");
    },
    [board]
  );

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="App">
      <div className={styles["app-container"]}>
        <section>
          <div className={styles["board-container"]}>
            <div>
              <img src="./logo ITESA.png" alt="ITESA" width={250} />
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
            <button type="button" onClick={() => copyCode()}>
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
