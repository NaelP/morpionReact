import { useState } from 'react'
import './App.css'

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove%2 === 0;
  const currentSquares = history[currentMove];
  const [descendingMoves, setDescendingMoves] = useState(false);
  const [positionMove, setPositionMove] = useState(Array(9).fill(null));

  const resetTab = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setPositionMove(Array(9).fill(null));
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleSaveMovePosition(moveIndex) {
    let newPositionHistory = positionMove.slice();
    let rowCol = getRowCol(moveIndex);
    newPositionHistory[currentMove] = rowCol;
    setPositionMove(newPositionHistory);
  }

  function getRowCol(movePosition) {
    const tailleGrille = 3;
    let row = Math.floor((movePosition-1) / tailleGrille);
    let col = (movePosition-1) % tailleGrille;
    return [row+1, col+1];
  }

  function jumpTo(nextMove) {
    let newHistory = history.slice()
    newHistory.length = nextMove+1;
    setCurrentMove(nextMove);
    setHistory(newHistory);
  }

  function handleDescending(value) {
    setDescendingMoves(value);
  }


  const moves = history.map((squares, move) => {
    let description;
    let indexMove = !descendingMoves ? move : (history.length - move) - 1;
    if (indexMove > 0) {
      description = 'Go to move #' + indexMove + ' ' + '(row ' + positionMove[indexMove-1][0] + ', col ' + positionMove[indexMove-1][1] + ')';
    } else {
      description = 'Go to game start';
    }
    return(<li key={indexMove}>
      <button onClick={() => jumpTo(indexMove)}>{description}</button>
    </li>)
  });

  return (
    <div className="row">
      <div className="col-6">
        <Board history={history} 
        xIsNext={xIsNext} 
        squares={currentSquares} 
        onPlay={handlePlay}
        onSaveMovePosition = {handleSaveMovePosition}/>    
        <ResetButton onClick={resetTab}/>
      </div>
      <div className="col-6">
      <div className="form-check">
        <input 
        className="form-check-input" 
        type="checkbox" 
        value={descendingMoves} 
        id="flexCheckDefault"
        onClick={(e)=>{handleDescending(e.target.checked)}}></input>
        <label 
        className="form-check-label" 
        htmlFor="flexCheckDefault">
          Moves descending order
        </label>
      </div>
        <ol>{moves}</ol>
      </div>
      <div>
        You're at move {currentMove}
      </div>
    </div>
  );

}

function Board({history, xIsNext, squares, onPlay, onSaveMovePosition}) {

  const handleClickTab = (myValue) => {
    if(squares[myValue] || winner) {
      return;
    }
    let nextSquare = squares.slice();
    if(xIsNext) {
      nextSquare[myValue] = 'X'
    } else {
      nextSquare[myValue] = 'O'
    }    

    onSaveMovePosition(myValue);

    onPlay(nextSquare);
  }

  function verifyWinner({squares, history, getWinners=false}) {

    const winnerTab = [
      [1,2,3],
      [4,5,6],
      [7,8,9],
      [1,4,7],
      [2,5,8],
      [3,6,9],
      [1,5,9],
      [3,5,7],
    ]
  
    for(let i=0; i<winnerTab.length; i++) {
      const [x,y,z] = winnerTab[i];
      let playerOptionX = squares[x];
      let playerOptionY = squares[y];
      let playerOptionZ = squares[z];
      if(playerOptionX != null && 
      playerOptionX == playerOptionY &&
      playerOptionY == playerOptionZ) {
        if(getWinners) {
          return winnerTab[i]
        }
        return playerOptionX
      }
    }
    if (history.length == 10) {
      return 'draw'
    }
    return null
  }

  const winner = verifyWinner({squares, history});
  let status;
  if (winner && winner != 'draw') {
    status = 'Winner: ' + winner;
  } else if(winner == 'draw'){
    status = "It's a draw !";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const winnersSquares = verifyWinner({squares, history, getWinners:true});

  

  const GridComponent = () => {
    const rows = Array(3).fill(null); 
    const cols = Array(3).fill(null);
    let i = 0;
    return (
      <div className="grid">
        {rows.map((_, rowIndex) => (
          <div key={rowIndex} style={{minHeight:'45px'}} className="row">
            {cols.map((_, colIndex) => {
              i++;
              const currentCounter = i;
              return (
              <Square winnersSquares={winnersSquares} numSquare={currentCounter-1} key={i} turn={squares[currentCounter]} onSquareClick={()=> {handleClickTab(currentCounter)}} />
            )})}
          </div>
        ))}
      </div>
    );
  };

  return <>
    {<div>{status}</div>}
    <div className="container">
      <div style={{maxWidth: "335px"}} className="row d-flex justify-content-center">
      <GridComponent/>
      </div>
    </div>
  </>

}

function Square ({winnersSquares,numSquare,turn, onSquareClick}) {
  let winStyle = winnersSquares != null && winnersSquares.includes(numSquare+1) ? {"borderCollapse":"collapse","border":"3px solid green"} : {"borderCollapse":"collapse","border":"1px solid black"};
  return <div style={winStyle} onClick={onSquareClick} className={"align-content-center morpionVal"+ numSquare +" col-2 text-center"}>{turn ?? ''}</div>
}

function ResetButton({onClick}) {
  return <div className="container mt-2">
  <button onClick={()=>onClick()} className={'btn btn-primary'}>Reset</button>
</div>
}

export default Game
