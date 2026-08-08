const numbersContainer = document.querySelector(".numbers");
const ticksContainer = document.querySelector(".ticks");
const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const secondHand = document.getElementById("second");

function createNumbers() {
  for (let i = 1; i <= 12; i++) {
    const number = document.createElement("div");
    number.className = "number";
    number.style.setProperty("--i", i);
    number.innerHTML = `<span>${i}</span>`;
    numbersContainer.appendChild(number);
  }
}

function createTicks() {
  for (let i = 0; i < 60; i++) {
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.style.setProperty("--i", i);
    if (i % 5 === 0) {
      tick.classList.add("major");
    }
    ticksContainer.appendChild(tick);
  }
}

function updateAnalogClock(now) {
  const milliseconds = now.getMilliseconds();
  const seconds = now.getSeconds() + milliseconds / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;
  hourHand.style.transform = `rotate(${hours * 30}deg)`;

  minuteHand.style.transform = `rotate(${minutes * 6}deg)`;

  secondHand.style.transform = `rotate(${seconds * 6}deg)`;
}

createNumbers();
createTicks();
