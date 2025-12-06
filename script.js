// --- Favorites System ---
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
  const card = star.closest('.game-card');
  const key = card.querySelector('h2')?.innerText || '';
  if (key && localStorage.getItem(key) === 'true') { star.classList.add('favorited'); }
  star.addEventListener('click', e => {
    e.preventDefault();
    if (!key) return;
    star.classList.toggle('favorited');
    localStorage.setItem(key, star.classList.contains('favorited'));
  });
});

// --- Search Functionality ---
const search = document.getElementById("search");
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();
  document.querySelectorAll(".game-card").forEach(card =>{
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(value) ? "flex" : "none";
  });
});

// --- Favorites Filter Button ---
const favButton = document.getElementById("filter-favorites");
let showingFavorites = false;
favButton.addEventListener("click", () => {
  showingFavorites = !showingFavorites;
  favButton.textContent = showingFavorites ? "Show All" : "Show Favorites";
  document.querySelectorAll(".game-card").forEach(card => {
    const star = card.querySelector(".star");
    if (showingFavorites) {
      card.style.display = star && star.classList.contains("favorited") ? "flex" : "none";
    } else {
      card.style.display = "flex";
    }
  });
});

// --- Winter Event ---
let snowInterval;
function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.textContent = "❄";
  snowflake.style.left = Math.random() * window.innerWidth + "px";
  const duration = 5 + Math.random() * 5;
  snowflake.style.animationDuration = duration + "s";
  document.body.appendChild(snowflake);
  setTimeout(() => snowflake.remove(), duration * 1000);
}
function startSnow() {
  if (!snowInterval) {
    snowInterval = setInterval(createSnowflake, 300);
    document.body.classList.add("winter");
  }
}
function stopSnow() {
  clearInterval(snowInterval);
  snowInterval = null;
  document.body.classList.remove("winter");
}

// --- Christmas Event ---
let christmasInterval;
let santaTimer;
function createChristmasItem() {
  const item = document.createElement("div");
  item.classList.add("falling");
  const options = ["🎄","🎁"];
  item.textContent = options[Math.floor(Math.random()*options.length)];
  item.style.left = Math.random() * window.innerWidth + "px";
  const duration = 5 + Math.random() * 5;
  item.style.animationDuration = duration + "s";
  item.style.fontSize = (1 + Math.random() * 0.5) + "rem";
  document.body.appendChild(item);
  setTimeout(() => item.remove(), duration * 1000);
}
function santaFlyAcross() {
  const santa = document.createElement("div");
  santa.textContent = "🎅";
  santa.style.position = "fixed";
  santa.style.top = "50px";
  santa.style.left = "-50px";
  santa.style.fontSize = "2rem";
  santa.style.zIndex = "9999";
  santa.style.transition = "left 10s linear";
  document.body.appendChild(santa);
  setTimeout(() => santa.style.left = window.innerWidth + "px", 100);
  setTimeout(() => santa.remove(), 11000);
}
function startChristmas() {
  if (!christmasInterval) {
    christmasInterval = setInterval(createChristmasItem, 400);
    santaTimer = setInterval(santaFlyAcross, 20000);
    document.body.classList.add("christmas");
  }
}
function stopChristmas() {
  clearInterval(christmasInterval);
  clearInterval(santaTimer);
  christmasInterval = null;
  santaTimer = null;
  document.body.classList.remove("christmas");
}

// --- Fireplace Event ---
let fireplaceInterval;
function createEmber() {
  const ember = document.createElement("div");
  ember.classList.add("falling");
  ember.textContent = "🔥";
  ember.style.left = Math.random() * window.innerWidth + "px";
  const duration = 3 + Math.random() * 4;
  ember.style.animationDuration = duration + "s";
  ember.style.fontSize = (1 + Math.random() * 1.5) + "rem";
  ember.style.filter = "drop-shadow(0 0 6px rgba(255,112,67,0.6))";
  document.body.appendChild(ember);
  setTimeout(() => ember.remove(), duration * 1000);
}
function startFireplace() {
  if (!fireplaceInterval) {
    fireplaceInterval = setInterval(createEmber, 500);
    document.body.classList.add("fireplace");
  }
}
function stopFireplace() {
  clearInterval(fireplaceInterval);
  fireplaceInterval = null;
  document.body.classList.remove("fireplace");
}

// --- Rare Party Event ---
let rareInterval;
function startRareEvent() {
  if (!rareInterval) {
    rareInterval = setInterval(() => {
      const emoji = Math.random() < 0.5 ? "🎉" : "🥳";
      const el = document.createElement("div");
      el.className = "partyEmoji";
      el.textContent = emoji;
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDuration = (3 + Math.random() * 2) + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, 300);
  }
}
function stopRareEvent() {
  clearInterval(rareInterval);
  rareInterval = null;
  document.querySelectorAll(".partyEmoji").forEach(el => el.remove());
}

// --- Random Event Selector ---
let lastEvent = null;
let rareStopTimeout = null;
let rareActive = false;

function runEvent(name) {
  stopSnow(); stopChristmas(); stopFireplace(); stopRareEvent();
  if (name === "rare") startRareEvent();
  else if (name === "snow") startSnow();
  else if (name === "christmas") startChristmas();
  else if (name === "fireplace") startFireplace();
}

function pickNormalEventNotSameAsLast() {
  const events = ["snow", "christmas", "fireplace"];
  let choice;
  do {
    choice = events[Math.floor(Math.random() * events.length)];
  } while (events.length > 1 && choice === lastEvent);
  return choice;
}

function chooseEventOnLoad() {
  const now = new Date();
  const minutes = now.getMinutes();

  // If past cutoff, don't start anything
  if (minutes >= 15) {
    stopSnow(); stopChristmas(); stopFireplace(); stopRareEvent();
    if (rareStopTimeout) { clearTimeout(rareStopTimeout); rareStopTimeout = null; }
    rareActive = false;
    return;
  }

  // At minute 0, rare chance
  if (minutes === 0 && Math.random() < 0.01) {
    rareActive = true;
    runEvent("rare");
    rareStopTimeout = setTimeout(() => {
      stopRareEvent();
      rareActive = false;
    }, 5 * 60 * 1000);
    return;
  }

  // Otherwise pick normal event
  const choice = pickNormalEventNotSameAsLast();
  lastEvent = choice;
  runEvent(choice);
}

function checkTime() {
  const now = new Date();
  const minutes = now.getMinutes();
  if (minutes >= 15) {
    stopSnow(); stopChristmas(); stopFireplace(); stopRareEvent();
    if (rareStopTimeout) { clearTimeout(rareStopTimeout); rareStopTimeout = null; }
    rareActive = false;
  }
}

// Pick event once on load
chooseEventOnLoad();
// Still check every minute to stop after 15
setInterval(checkTime, 60000);
