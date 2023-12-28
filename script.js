"use strict";

// main global variables
let numOfPlayer = 2;
const playersCards = {};
let allCards = 0;
let cardsOnTable = [];
let prevCard = {};
let lastCard = {};
let handsOnTable = [];
let currentPlayer = "Player 1";
let placedHands = [];

// fetching deck of card
const fetchDeckCard = async () => {
  try {
    const res = await fetch(
      "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const data = await res.json();
    console.log(data.deck_id);
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

    const startBtn = document.querySelector("#startBtn");
    startBtn.textContent = "Restart";

    allCards = data.cards;
    console.log("www", allCards);
    spreadCards();
    return allCards;
  } catch (err) {
    console.log("Error on drawing cards:", err);
  }
};

const spreadCards = () => {
  const cardDealer = Math.floor(allCards.length / numOfPlayer);
  console.log("22", allCards);
  for (let i = 1; i <= numOfPlayer; i++) {
    console.log("count:", cardDealer);
    const playerCards = allCards.splice(0, cardDealer);
    playersCards[`Player ${i}`] = playerCards;
    console.log(playerCards);

    let cards = playersCards[`Player ${i}`];
    console.log("cards", cards);
    cards.forEach(() => {
      const backOfCard = document.createElement("img");
      backOfCard.src = "https://www.deckofcardsapi.com/static/img/back.png";
      backOfCard.style.width = "100px";
      backOfCard.className = `player${i}Cards`;

      const playerDiv = document.querySelector(`.player${i}`);
      playerDiv.append(backOfCard);
    });
  }
  console.log("playersCards", playersCards);
  return playersCards;
};

// placing cards on the table
const placeCard = (player) => {
  if (player !== currentPlayer) {
    currentPlayer = player;
    return currentPlayer;
  }
  //   else if (placedHands.length !== numOfPlayer) {
  //     alert("Everybody should put hands");
  //   }
  const currentPlayerCards = playersCards[currentPlayer];
  if (currentPlayerCards.length === 0) {
    console.log("Player has no more cards to place.");
    return;
  }
  const currentPlayerCard = currentPlayerCards.pop();
  cardsOnTable.push(currentPlayerCard);

  if (lastCard.code) {
    prevCard = lastCard;
  }
  lastCard = currentPlayerCard;

  currentPlayer = player === "Player 1" ? "Player 2" : "Player 1";
  console.log("Player", currentPlayer, "turn to place a card.");
  console.log("Cards on table:", cardsOnTable);
  console.log("Previous card:", prevCard);
  console.log("Last card:", lastCard);
};

const paintCardsOnTable = () => {
  const gameTable = document.querySelector(".gameTable");

  cardsOnTable.forEach((el) => {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";

    const card = document.createElement("div");
    card.className = "card";
    card.daraset.code = el.code;

    const frontOfCard = document.createElement("img");
    frontOfCard.src = el.image;

    const backOfCard = document.createElement("img");
    backOfCard.src = "https://www.deckofcardsapi.com/static/img/back.png";

    card.append(frontOfCard);
    card.append(backOfCard);
    cardContainer.append(card);
    gameTable.append(cardContainer);

    //  click event to each card
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
};

const decideLoser = () => {
  let loser;
  setTimeout(() => {
    if (placedHands.length > 1) {
      loser = placedHands[placedHands.length - 1];
      return loser;
    } else {
      alert("All players must put their hands");
    }
  }, 1000);
};

const placeHand = (player) => {
  if (!cardsOnTable.length) {
    return;
  } else if (cardsOnTable.length === 1) {
    playersCards[player].unshift(cardsOnTable[0]);
    return;
  }

  placedHands.push(player);
  if (prevCard.suit !== lastCard.suit) {
    let loser = placedHands[0];
    playersCards[loser] = [...cardsOnTable, ...playersCards[loser]];
    prevCard = {};
    cardsOnTable = [];
    placedHands = [];
    console.log("player card on mismatch", playersCards);
    return;
  }

  if (numOfPlayer === placedHands.length) {
    const loser = decideLoser();
    playersCards[loser] = [...cardsOnTable, ...playersCards[loser]];
    prevCard = {};
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

const volumeIcon = document.querySelector("#volumeIcon");
let isMuted = false;
let audio = new Audio("mixkit-christmas-jazz-503.mp3");
volumeIcon.addEventListener("click", () => {
  if (!isMuted) {
    audio.pause();
    isMuted = true;
    volumeIcon.textContent = "🔇";
  } else {
    audio.play();
    isMuted = false;
    volumeIcon.textContent = "🔊";
  }
});

// restart the game
const restartGame = async () => {
  if (startBtn.textContent === "Restart") {
    const allCards = await fetchDeckCard();
    drawCards(allCards);
  }
};

// fetchDeckCard();
// drawCards();
// placeCard();
// paintCardsOnTable();
// placeHand();
// decideLoser();
// restartGame();
