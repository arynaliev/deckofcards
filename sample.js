//global variables
let numOfPlayer = 2; //minimum 2 players
const playersCards = {};
let cardsOnTable = [];
let placedHands = [];
let prevCard = {};
let currentCard = {};
let currentPlayer = "player-1";

//button handlers
const onMinusClick = () => {
  if (numOfPlayer === 2) {
    return alert("Minimum number is 2");
  } else if (numOfPlayer === 4) {
    return alert("Maximum number of players is 4");
  } else {
    numOfPlayer--;
  }
};

const onPlusClick = () => {
  if (numOfPlayer === 4) {
    return alert("Maximum number of players is 4");
  } else {
    numOfPlayer++;
  }
};

//get deck of cards and save it in local storage
const fetchDeckCard = async () => {
  const res = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1 "
  );
  const data = await res.json();
  return data.deck_id;
};

const drawCards = async () => {
  let deckId = await fetchDeckCard();
  console.log(deckId);
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`
  );
  const data = await response.json();
  return data.cards;
};

//RESTART THE GAME
const restartGame = async () => {
  const allCards = await drawCards();
  spreadCards(allCards);
};

//spread the cards to each player
const spreadCards = (cardsList) => {
  const playerCardCount = Math.floor(cardsList.length / numOfPlayer);
  for (let i = 1; i <= numOfPlayer; i++) {
    console.log(playerCardCount);
    const playerCards = cardsList.splice(0, playerCardCount);
    playersCards[`player-${i}`] = playerCards;
  }
  console.log("playerCards", playersCards);
};

const placeCard = (player) => {
  if (player !== currentPlayer) {
    return;
  } else if (placedHands.length !== 0) {
    alert("everybody should put hands");
  }
  const playerCard = playersCards[player].pop();
  cardsOnTable.push(playerCard);
  if (currentCard.code) {
    prevCard = currentCard;
    currentCard = playerCard;
  } else {
    currentCard = playerCard;
  }
  currentPlayer = player === "player-1" ? "player-2" : "player-1";

  // if(currentPlayer === "")
  console.log("cards on table", cardsOnTable);
  console.log("current Card", currentCard);
  console.log("prev Card", prevCard);
};

const decideLoser = () => {
  let loser;
  if (placedHands.length > 1) {
    loser = placedHands[placedHands.length - 1];
    return loser;
  } else {
    alert("All players must put hands");
  }
};

const placeHand = (player) => {
  //if no cards on the table
  if (!cardsOnTable.length) {
    return;
  } else if (cardsOnTable.length === 1) {
    //if only one card on the table
    playersCards[player].unshift(cardsOnTable[0]);
    return;
  }

  placedHands.push(player);
  //if wrong placement
  if (prevCard.suit !== currentCard.suit) {
    //if wrong placement, all cards on the table goes to last one;
    let loser = placedHands[0];
    playersCards[loser] = [...cardsOnTable, ...playersCards[loser]];
    cardsOnTable = [];
    placedHands = [];
    console.log("player card on mismatch", playersCards);
    return;
  }
  //if all players placed their hands
  if (Object.keys(playersCards).length === placedHands.length) {
    //if correct placement, all cards on the table goes to last one
    const loser = decideLoser();
    playersCards[loser] = [...cardsOnTable, ...playersCards[loser]];
    cardsOnTable = [];
    placedHands = [];
    console.log("player card on match", playersCards);
  }
};

//keyboard event listeners
window.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    //player 1 puts card
    placeCard("player-1");
  } else if (e.key === "p") {
    //player 2 puts card
    placeCard("player-2");
  } else if (e.key === "q") {
    //player 1 puts hand
    placeHand("player-1");
  } else if (e.key === "o") {
    //player 2 puts hand
    placeHand("player-2");
  }
});
