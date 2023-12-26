"use strict";

let player1Cards = [];
let player3Cards = [];
let cardsOnTable = [];
let prevCard = {};
let lastCard = {};
let handsOnTable = [];

const fetchDeckCard = async () => {
  try {
    const localDeckId = localStorage.getItem("deck_id");
    if (!localDeckId) {
      const res = await fetch(
        "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const data = await res.json();
      localStorage.setItem("deck_id", data.deck_id);
      return data.deck_id;
    } else {
      return localDeckId;
    }
  } catch (err) {
    console.log(err);
  }
};

const drawCards = async () => {
  try {
    let deck_id = await fetchDeckCard();
    const res = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=20`
    );
    const data = await res.json();

    let cards = data.cards;
    const cardsImg = cards.forEach((el, index) => {
      const img = document.createElement("img");
      img.src =
        "https://images.squarespace-cdn.com/content/v1/5abd8db4620b85fa99f15131/1542340370129-WV43BVUJLUTWL6FRRK52/Card+Back+2.0+-+Poker+Size+-+Red_shw.png";
      img.style.width = "100px";

      const player1 = document.querySelector(".player1");
      const player2 = document.querySelector(".player2");

      if (index === 0 || index % 2 === 0) {
        player1.append(img);
      } else {
        player2.append(img);
      }
    });

    const drawBtn = document.querySelector("#drawBtn");
    drawBtn.remove();

    console.log(data);
    return data;
  } catch (err) {
    console.log("Error drawing cards", err);
  }
};
