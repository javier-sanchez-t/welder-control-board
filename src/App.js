import logo from "./logo.svg";
import "./App.css";
import Row from "./components/row";
import Button from "./components/button";
import Component from "./components/component";

function App() {
  const board = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  return (
    <div className="App">
      <Component />
      {board.map((row, rowIndex) => {
        return (
          <Row key={"row_" + rowIndex}>
            {row.map((column, columnIndex) => {
              return <Button key={"button_" + columnIndex} />;
            })}
          </Row>
        );
      })}
    </div>
  );
}

export default App;
