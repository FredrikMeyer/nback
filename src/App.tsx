import React from "react";
import "./App.css";

const numbers = ["A", "O", "P", "F"];
const maxTime = 30;
const delay = 1000;

function randomNumber() {
  const index = Math.floor(Math.random() * numbers.length);

  return numbers[index];
}

function correctGuess(numbers: string[], depth: number): boolean {
  return numbers[0] === numbers[depth];
}

function Level({
  level,
  setLevelHandler,
}: {
  level: number;
  setLevelHandler: (l: number) => void;
}) {
  return (
    <div>
      <div>
        <input
          name="level"
          type="range"
          min="1"
          max="9"
          value={level}
          onChange={(e) => {
            setLevelHandler(Number(e.target.value));
          }}
        />
      </div>
      <div>
        <label htmlFor="level"> Level: {level}.</label>
      </div>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <meter
      min="0"
      max={maxTime}
      value={step}
      low={0.33 * maxTime}
      high={maxTime * 0.66}
      optimum={0}
      style={{ width: "70%" }}
    />
  );
}

function App() {
  const [numbers, setNumbers] = React.useState([randomNumber()]);
  const [step, setStep] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [isWrong, setIsWrong] = React.useState(false);
  const [level, setLevel] = React.useState(1);
  const [intervalId, setIntervalId] = React.useState(0);
  const [state, setState] = React.useState<"BEFORE" | "RUNNING" | "AFTER">(
    "BEFORE"
  );

  if (state === "RUNNING" && step >= maxTime) {
    clearInterval(intervalId);
    setState("AFTER");
  }

  function update() {
    setNumbers((numbers) => [randomNumber(), ...numbers].slice(0, 10));
    setStep((step) => step + 1);
    setIsCorrect(false);
    setIsWrong(false);
  }

  function start() {
    update();
    const id = setInterval(update, delay);
    setIntervalId(id);
    setState("RUNNING");
  }

  const startHandler = () => start();

  const guessNumberHandler = () => {
    const correct = correctGuess(numbers, level);
    if (correct) {
      console.log("YAY");
      setIsCorrect(true);
      setScore((sc) => sc + 1);
    } else {
      setIsWrong(true);
      setScore((sc) => sc - 1);
      console.log("WRONG");
    }
  };

  const setLevelHandler = (n: number) => {
    setLevel(n);
    setState("BEFORE");
    setStep(0);
    setScore(0);
  };

  return (
    <div
      style={{
        fontSize: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "90vh",
        alignItems: "center",
      }}
    >
      <div>
        <h1>n-back</h1>
        <p>
          Recall the letter <code>n</code> levels back.
        </p>
      </div>
      <Level level={level} setLevelHandler={setLevelHandler} />
      <div
        onClick={state === "BEFORE" ? startHandler : guessNumberHandler}
        style={{
          border: "6px double black",
          borderRadius: "50%",
          width: "min(60vw, 600px)",
          lineHeight: "min(60vw, 600px)",
          aspectRatio: 1,
          textAlign: "center",
          fontSize: 50,
          fontWeight: "bolder",
          color:
            isCorrect || isWrong ? "white" : step % 2 === 0 ? "red" : "blue",
          backgroundColor: isCorrect ? "green" : isWrong ? "red" : "white",
        }}
      >
        <div>
          {state === "BEFORE" ? (
            "START"
          ) : state === "RUNNING" ? (
            numbers[0]
          ) : (
            <>Score: {score}</>
          )}
        </div>
      </div>
      <Progress step={step} />
      <div>Score: {score}</div>
    </div>
  );
}

export default App;
