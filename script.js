"use strict";

// main global variables
let numOfPlayer = 2;
// let player1Cards = [];
// let player2Cards = [];
const playersCards = {};
let cardsOnTable = [];
let prevCard = {};
let lastCard = {};
let handsOnTable = [];
let currentPlayer = "Player 1";

// back of card
const backOfCard =
  "https://images.squarespace-cdn.com/content/v1/5abd8db4620b85fa99f15131/1542340370129-WV43BVUJLUTWL6FRRK52/Card+Back+2.0+-+Poker+Size+-+Red_shw.png";

// fetching deck of card
const fetchDeckCard = async () => {
  try {
    const res = await fetch(
      "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const data = await res.json();
    return data.deck_id;
  } catch (err) {
    console.log("Error on fetching the data:", err);
  }
};

// drawing cards
const drawCards = async () => {
  try {
    let deckId = await fetchDeckCard();
    const res = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=30`
    );
    const data = await res.json();
    return data.cards;
  } catch (err) {
    console.log("Error on drawing cards:", err);
  }
};

// let cards = data.cards;
// const cardsImg = cards.forEach((el, index) => {
//   const img = document.createElement("img");
//   img.src = backOfCard;
//   img.style.width = "100px";

//   const player1 = document.querySelector(".player1");
//   const player2 = document.querySelector(".player2");

//   if (index === 0 || index % 2 === 0) {
//     player1.append(img);
//     img.className = "player1Cards";
//   } else {
//     player2.append(img);
//     img.className = "player2Cards";
//   }
// });

const spreadCards = (cardsList) => {
  const playerCardCount = Math.floor(cardsList.length / numOfPlayer);
  for (let i = 0; i <= numOfPlayer; i++) {
    console.log(playerCardCount);
    const playerCards = cardsList.splice(0, playerCardCount);
    playersCards[`player-${i}`] = playerCards;
  }
  console.log("playerCards", playersCards);
};

const placeCard = (player) => {
  if (player !== currentPlayer) {
    return;
  } else if (placedHands.length !== numOfPlayer) {
    alert("Everybody should put hands");
  }

  const playerCard = playersCards[player].pop();
  cardsOnTable.push(playerCard);

  if (currentCard.code) {
    prevCard = currentCard;
    currentCard = playerCard;
  } else {
    currentCard = playerCard;
  }

  currentPlayer = player === "Player 1" ? "Player 2" : "Player 1";

  console.log("cards on table", cardsOnTable);
  console.log("current card", currentCard);
  console.log("previous card", prevCard);
};

const decideLoser = () => {
  let loser;
  if (placedHands.length > 1) {
    loser = placedHands[placedHands.length - 1];
    return loser;
  } else {
    alert("All players must put their hands");
  }
};

const placeHand = (player) => {
  if (!cardsOnTable.length) {
    return;
  } else if (cardsOnTable.length === 1) {
    playersCards[player].unshift(cardsOnTable[0]);
    return;
  }

  placedHands.push(player);
  if (prevCard.suit !== currentCard.suit) {
    let loser = placedHands[0];
    playersCards[loser] = [...cardsOnTable, ...playersCards[loser]];
    cardsOnTable = [];
    placedHands = [];
    console.log("player card on mismatch", playersCards);
    return;
  }

  if (Object.keys(playersCards).length === placedHands.length) {
    const loser = decideLoser();
    playersCards[loser] = [...cardsOnTable, ...playersCards[loser]];
    cardsOnTable = [];
    placedHands = [];
    console.log("player card on match", playersCards);
  }
};

// keyboard event listeners
window.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    // player 1 puts card
    placeCard("Player 1");
  } else if (e.key === "p") {
    //player 2 puts card
    placeCard("Player 2");
  } else if (e.key === "q") {
    //player 1 puts hand
    placeHand("Player 1");
  } else if (e.key === "o") {
    //player 2 puts hand
    placeHand("Player 2");
  }
});

const restartGame = async () => {
  const allCards = await drawCards();
  spreadCards(allCards);
};
