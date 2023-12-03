import { useState } from "react";
import Log from "./components/Log.jsx"
import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";
import GameOver from "./components/GameOver.jsx";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];


function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length>0 && gameTurns[0].player === "X") {
    currentPlayer = "O"
  }
  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for (const turn of gameTurns) {
      const {square, player} = turn
      const {row, col} = square

      gameBoard[row][col]=player;
  }
  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner = undefined

  for (const combinations of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combinations[0].row][combinations[0].column]
    const secondSquareSymbol= gameBoard[combinations[1].row][combinations[1].column]
    const thirdSquareSymbol= gameBoard[combinations[2].row][combinations[2].column]

    if (firstSquareSymbol && firstSquareSymbol===secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      winner = players[firstSquareSymbol];
    }

  }
  return winner;
}

function App() {
 const [players, setPlayers] =useState({
  X:'Player 1',
  O: 'Player 2'
 })
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns) 
const winner = deriveWinner(gameBoard, players);
const isDraw = gameTurns.length === 9 && !winner;


  // const [activePlayer, setActivePlayer] = useState("X");
  function handleSelectSquare(rowIndex, colIndex) {
    // setActivePlayer((curActivePlayer) => curActivePlayer === "X" ? "O" : "X");
    setGameTurns(prevGameTurns => {
      const currentPlayer = deriveActivePlayer(prevGameTurns);

      const updatedTurns = [{square: {row:rowIndex, col:colIndex}, player: currentPlayer},...prevGameTurns];
      return updatedTurns;
    } )
    
   ;
  }

function handleRestart() {
  setGameTurns([]);
}

function handlePlayerNameChange (symbol, newName) {
  setPlayers(prevPlayers => {
    return {
      ...prevPlayers,
      [symbol]: newName
    };
  });
}

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName="player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || isDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          activePlayerSymbol={activePlayer}
          board = {gameBoard}
        />
      </div>
      <Log turns= {gameTurns}/>
    </main>
  );
}

export default App;
