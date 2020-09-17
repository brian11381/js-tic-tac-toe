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
  const gameOverMsg = document.querySelector('#game-over-message');
  const retry = document.querySelector('#retry');
  const gameOverPage = document.querySelector('#game-over-page');
  const exit = document.querySelector('#exit');
  const player1Status = document.querySelector('#player1-status');
  const player2Status = document.querySelector('#player2-status');


  //Event listeners
  btnPickGame.forEach(btn => btn.addEventListener('click', setGameType));
  btnPickGame.forEach(btn => btn.addEventListener('click', updateInputs));
  btnStartGame.addEventListener('click', checkPlayers);
  cells.forEach(cell => cell.addEventListener('click', playerMove));
  retry.addEventListener('click', checkPlayers);
  exit.addEventListener('click', resetPage);

  function showPlayerStatus(players, current){
    if(players[0] == current){
      console.log('match');
    }
  }
  function resetPage(){
    removeHidden(welcomPage);
    btnPickGame.forEach(btn => removeHidden(btn));
    addHidden(gameOverPage, player1Div, player2Div, startDiv);
  }

 
  function botMove(index, mark){
    cells[index].textContent = mark;
  }

  function playerMove(){
    if(checkPlayerMove(this)){
      position = this.id[2];
      let mark = gameLogic.PlayerMove();
      this.textContent = mark;
      gameLogic.updateBoard(position, mark);
    }else {
      return;
    }
  }
  function checkPlayerMove(elem){
    if(elem.textContent == 'X' || elem.textContent =="O"){
      return false;
    }else{
      return true;
    }
  }

  function winnerScreen(winner){
    gameOverMsg.textContent = `${winner} wins!!!`;
    removeHidden(gameOverPage);
  }

  function drawScreen(){
    gameOverMsg.textContent = "Draw!!!";
    removeHidden(gameOverPage);
  }

  // Cell ID's are set up to correspond to grid position
  // i.e. tl == top right
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

  //Form validation for name input
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
    addHidden(welcomPage);
    addHidden(gameOverPage);
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
    btnPickGame.forEach(btn => addHidden(btn));
    removeHidden(player1Div, startDiv);
    if(this.id == "pvp"){
      removeHidden(player2Div);
    }
  }

  function addHidden(...elem){
    elem.forEach(e => {
      e.classList.add('hide');
    });
  }

  function removeHidden(...elem){
    elem.forEach(e => {
      e.classList.remove('hide');
    });
  }

  function nameError(elem){
    elem.style.border = "6px solid red";
  }

  return {getPlayers, winnerScreen, drawScreen, botMove, showPlayerStatus};

})();


//Game logic module
const gameLogic = (function(){
  
  let gameBoard = [0,1,2,3,4,5,6,7,8];
  let validMoves = [0,1,2,3,4,5,6,7,8];
  let players;
  let currentPlayer;
  let gameOver = false;

  function PlayerMove(){
    return currentPlayer.mark;
  }

  //Probably a better way to do this
  // but it works
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
      gameOver = true;
      return;
    }if (!gameBoard.join('').match(regex)){
      gameOver = true;
      declareDraw();
    }
  }  
      
  function declareDraw(){
     displayController.drawScreen();
  } 

  function declareWinner(){
    displayController.winnerScreen(currentPlayer.name);
  }
  
  function updateBoard(position, mark){
    gameBoard.splice(position, 1, mark);
    checkWinConditions();
    endTurn();
    updateValidMoves();
    if(gameOver == false){
      checkBotTurn();
    }
  }

  function startGame(){
    gameOver = false;
    gameBoard = [0,1,2,3,4,5,6,7,8];
    updateValidMoves();
    players = displayController.getPlayers();
    setPlayerMark(players);
    setPlayerTurn(players);
    // displayController.showPlayerStatus(players, currentPlayer);
    checkBotTurn();
  }
  

  function checkBotTurn(){
    if (currentPlayer.name == "AI Bot"){
      botMove();
    }
  }
  function botMove(){
    let bot = currentPlayer;
    let len = validMoves.length;
    let rand = Math.floor(Math.random()*len);
    let index = validMoves[rand];
    displayController.botMove(index, bot.mark);
    updateBoard(index, bot.mark);
     
  }

  function updateValidMoves(){
    validMoves = gameBoard
      .join('')
      .split('X')
      .join('')
      .split('O')
      .join('')
      .split('');
  }

  function setPlayerMark(players){
    let rand = Math.round(Math.random());
    if (rand == 0){
    players[0].mark = 'X';
    players[1].mark = 'O';
    }else {
    players[0].mark = 'O';
    players[1].mark = 'X';
    }
  }
  
  function setPlayerTurn(players){
    let rand = Math.round(Math.random());
    if (rand == 0){
    currentPlayer = players[0];
    }else {
    currentPlayer = players[1];
    }
  }

  function endTurn(){
    if(currentPlayer == players[0]){
      currentPlayer = players[1];
    }else {
      currentPlayer = players[0];
    }
  }



  return {startGame, PlayerMove, updateBoard};
})();


//Player object creator
const playerFactory = (name) => {
  return {name};
}




























































