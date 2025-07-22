import React, { useState, useEffect } from "react";
import "./App.css";

// Color constants for the palette
const COLORS = {
  primary: "#1976D2",   // X player (blue)
  secondary: "#424242", // O player (dark gray)
  accent: "#FFC107",    // Alert/accent (yellow)
};

/**
 * Checks if there's a winner on the current board state.
 * @param {string[]} squares 1D array of 9 squares ('X', 'O', or '')
 * @returns {string|boolean|undefined} Returns 'X', 'O', 'draw', or undefined if not ended.
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** This is a public function. */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],   // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   // Columns
    [0, 4, 8], [2, 4, 6],              // Diagonals
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every(Boolean)) return "draw";
  return undefined;
}

/**
 * Single square (cell) component; displays X, O, or blank.
 */
function Square({ value, onClick, highlight }) {
  let style = {
    color:
      value === "X"
        ? COLORS.primary
        : value === "O"
        ? COLORS.secondary
        : undefined,
    cursor: value ? "default" : "pointer",
    backgroundColor: highlight
      ? COLORS.accent + "33" // subtle accent (20% opacity)
      : "var(--bg-secondary)",
    transition: "background 0.2s",
  };

  return (
    <button
      className="ttt-square"
      style={style}
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : "Empty square"}
      disabled={!!value}
    >
      {value}
    </button>
  );
}

/**
 * The Tic Tac Toe board component.
 */
function Board({ squares, onSquareClick, winningLine }) {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onSquareClick(i)}
      highlight={winningLine && winningLine.includes(i)}
    />
  );

  // Render 3x3 grid
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(3 * row + col))}
        </div>
      ))}
    </div>
  );
}

/**
 * Returns the winning line if exists, else null.
 */
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],   // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   // Columns
    [0, 4, 8], [2, 4, 6],              // Diagonals
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

/**
 * Main App: Tic Tac Toe Game
 */
// PUBLIC_INTERFACE
function App() {
  /** This is a public function. */
  // "X" starts
  const [squares, setSquares] = useState(Array(9).fill(""));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(undefined); // 'X', 'O', 'draw', or undefined
  const [winningLine, setWinningLine] = useState(null);

  // On board state change, check for game outcome
  useEffect(() => {
    const result = calculateWinner(squares);
    setWinner(result);
    setGameOver(!!result);
    setWinningLine(getWinningLine(squares));
  }, [squares]);

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    /** This is a public function. */
    if (gameOver || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /** This is a public function. */
    setSquares(Array(9).fill(""));
    setXIsNext(true);
    setGameOver(false);
    setWinner(undefined);
    setWinningLine(null);
  }

  // Player indicator style
  const turnColor = xIsNext ? COLORS.primary : COLORS.secondary;

  let statusMessage;
  if (winner === "X" || winner === "O") {
    statusMessage = (
      <div className="ttt-status" style={{ color: COLORS.accent }}>
        <b>
          Player{" "}
          <span style={{ color: winner === "X" ? COLORS.primary : COLORS.secondary }}>
            {winner}
          </span>{" "}
          wins!
        </b>
      </div>
    );
  } else if (winner === "draw") {
    statusMessage = (
      <div className="ttt-status" style={{ color: COLORS.accent }}>
        <b>It&apos;s a draw!</b>
      </div>
    );
  } else {
    statusMessage = (
      <div className="ttt-status" style={{ color: turnColor }}>
        Player <strong>{xIsNext ? "X" : "O"}</strong>&rsquo;s turn
      </div>
    );
  }

  return (
    <div className="ttt-app-bg">
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        {statusMessage}
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <div className="ttt-controls">
          <button
            className="ttt-btn"
            onClick={handleReset}
            style={{
              backgroundColor: COLORS.primary,
              color: "#fff",
              fontWeight: 600,
            }}
            aria-label="Reset or play again"
          >
            {winner ? "Play Again" : "Reset"}
          </button>
        </div>
        <footer className="ttt-footer">
          <span>
            <strong style={{ color: COLORS.primary }}>X</strong>: Player 1 &nbsp; &nbsp;
            <strong style={{ color: COLORS.secondary }}>O</strong>: Player 2
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
