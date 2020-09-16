//Dom manipulation module
const displayController = (function(){
  //Variables
  let gameType;
  let playerOne;
  let playerTwo;
  let position;
  //Dom elements
  const welcomPage = document.querySelector('#welcome-page');
  const btnPickGame = document.querySelectorAll('.pick-game');
  const player1Div = document.querySelector('#player1-div');
  const player2Div = document.querySelector('#player2-div');
  const btnStartGame = document.querySelector('#start-game');
  const startDiv = document.querySelector('#start-div');
  const player1Input = document.querySelector('#player1-name');
  const player2Input = document.querySelector('#player2-name');
  const cells = document.querySelectorAll('.cell');

  //Event listeners
  btnPickGame.forEach(btn => btn.addEventListener('click', setGameType));
  btnPickGame.forEach(btn => btn.addEventListener('click', updateInputs));
  btnStartGame.addEventListener('click', checkPlayers);
  cells.forEach(cell => cell.addEventListener('click', playerMove));


  function setPosition(){
    return position;
  }

  function playerMove(){
    position = this.id[2];
    let mark = gameLogic.PlayerMove();
    this.textContent = mark;
    gameLogic.updateBoard(position, mark);
  }

  function winnerScreen(winner){
    console.log(winner);
  }

  function drawScreen(){
    console.log('draw');
  }

  (function fixGridBorders(){
    cells.forEach(cell => {
      if(cell.id.includes("t")){
        cell.style.borderTop = 'none';
      }if(cell.id.includes("b")){
        cell.style.borderBottom = 'none';
      }if(cell.id.includes("l")){
        cell.style.borderLeft = 'none';
      }if(cell.id.includes("r")){
        cell.style.borderRight = 'none';
      }
    })  
  })();

  function getPlayers(){
    return [playerOne, playerTwo];
  }
  function checkPlayers(){
    if(player1Input.value == ""){
      nameError(player1Input);
      return;
    }
    if (gameType == 'pvp' && player2Input.value == ""){
      nameError(player2Input);
      return;
    }
    else {
      createPlayers();
      displayNewGame();
      gameLogic.startGame();
    }
  }
  
  function displayNewGame(){
    toggleHidden(welcomPage);
    cells.forEach(cell => cell.textContent = "");
  }

  function createPlayers(){
    playerOne = playerFactory(player1Input.value);
    if(gameType == "pvp"){
      playerTwo = playerFactory(player2Input.value);
    }else{
      playerTwo = playerFactory('AI Bot');
    }
  }

  function setGameType(){
    gameType = this.id;
  }

  function updateInputs(){
    btnPickGame.forEach(btn => toggleHidden(btn));
    toggleHidden(player1Div);
    toggleHidden(startDiv);
    if(this.id == "pvp"){
      toggleHidden(player2Div);
    }
  }

  function toggleHidden(elem){
    elem.classList.toggle('hide');
  }

  function nameError(elem){
    elem.style.border = "6px solid red";
  }

  return {getPlayers, winnerScreen, drawScreen};

})();






//Game logic module
const gameLogic = (function(){
  
  const gameBoard = [0,1,2,3,4,5,6,7,8];
  let players;
  let currentPlayerTurn = 1;

  function PlayerMove(){
    if (currentPlayerTurn == 1){
      endTurn();
      return "X";
    }else {
      endTurn();
      return "O";
    }
  }
  function checkWinConditions(){
    let g = gameBoard;
    let regex = /[0-9]/g
    if (g[0] == g[1] && g[0] ==g[2]||
       g[3] == g[4] && g[3] ==g[5]||
       g[6] == g[7] && g[6] ==g[8]||
       g[0] == g[3] && g[0] ==g[6]||
       g[1] == g[4] && g[1] ==g[7]||
       g[2] == g[5] && g[2] ==g[8]||
       g[0] == g[4] && g[0] ==g[8]||
       g[2] == g[4] && g[2] ==g[6])
    {
      declareWinner();
    }if (!gameBoard.join('').match(regex)){
      declareDraw();
    }
  }  
      
   function declareDraw(){
     displayController.drawScreen();
   } 
  

  function declareWinner(){
    if(currentPlayerTurn == 2){
      displayController.winnerScreen(players[0].name);
    }else{
      displayController.winnerScreen(players[1].name);
    }
  }
  
  function updateBoard(position, mark){
    gameBoard.splice(position, 1, mark);
    checkWinConditions();
  }

  function startGame(){
    players = displayController.getPlayers();
    setPlayerMark(players);
    setPlayerTurn(players);
  }
  
  function setPlayerMark(players){
    players[0].mark = "X";
    players[1].mark = "O";
    }
  
  function setPlayerTurn(players){
    players[0].turn = 1;
    players[1].turn = 2;
  }

  function endTurn(){
    if(currentPlayerTurn == 1){
      currentPlayerTurn =2;
    }else {
      currentPlayerTurn =1;
    }
  }



  return {startGame, PlayerMove, updateBoard};
})();


//Player creator
const playerFactory = (name) => {
  return {name};
}



























































