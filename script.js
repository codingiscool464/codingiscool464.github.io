// --- Underwater Event ---
let underwaterInterval;
function createFish() {
  const fish = document.createElement("div");
  fish.classList.add("fish");
  // Random fish emoji
  const options = ["🐟","🐠","🐡"];
  fish.textContent = options[Math.floor(Math.random()*options.length)];
  // Random vertical position
  const randY = Math.random();
  fish.style.setProperty("--rand-y", randY);
  // Random size
  fish.style.fontSize = (1.5 + Math.random() * 1.5) + "rem";
  document.body.appendChild(fish);
  // Remove after animation
  setTimeout(() => fish.remove(), 12000);
}
function startUnderwater() {
  if (!underwaterInterval) {
    underwaterInterval = setInterval(createFish, 1000);
    document.body.classList.add("underwater");
  }
}
function stopUnderwater() {
  clearInterval(underwaterInterval);
  underwaterInterval = null;
  document.body.classList.remove("underwater");
  document.querySelectorAll(".fish").forEach(el => el.remove());
}

// --- Random Event Selector ---
let lastEvent = null;
let rareStopTimeout = null;
let rareActive = false;

function runEvent(name) {
  // stop all events before starting new one
  stopSnow(); stopChristmas(); stopFireplace(); stopRareEvent(); stopUnderwater();
  if (name === "rare") startRareEvent();
  else if (name === "snow") startSnow();
  else if (name === "christmas") startChristmas();
  else if (name === "fireplace") startFireplace();
  else if (name === "underwater") startUnderwater();
}

function pickNormalEventNotSameAsLast() {
  const events = ["snow", "christmas", "fireplace", "underwater"];
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
    stopSnow(); stopChristmas(); stopFireplace(); stopRareEvent(); stopUnderwater();
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
    stopSnow(); stopChristmas(); stopFireplace(); stopRareEvent(); stopUnderwater();
    if (rareStopTimeout) { clearTimeout(rareStopTimeout); rareStopTimeout = null; }
    rareActive = false;
  }
}

// Pick event once on load
chooseEventOnLoad();
// Still check every minute to stop after 15
setInterval(checkTime, 60000);
