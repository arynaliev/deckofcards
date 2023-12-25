"use strict";

const fetchDeckCard = async () => {
  try {
    const localDeckId = localStorage.getItem("deck_id");
    if (!localDeckId) {
      const res = await fetch(
        "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      const data = await res.json();
      localStorage.setItem("deckId", data.deck_id);
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
      `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=6`
    );
    const data = await res.json();
    let cards = data.card;
    cards.forEach((el) => {
      const img = document.createElement("img");
      img.src = el.image;
      img.style.width = "40px";
      const container = document.getElementsByClassName("container");
      container.appendChild(img);
    });

    //  console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
