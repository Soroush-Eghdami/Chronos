const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const startButton = document.getElementById("startStopwatch");
const lapButton = document.getElementById("lapStopwatch");
const resetButton = document.getElementById("resetStopwatch");
const lapList = document.getElementById("lapList");
const stopwatchStatus = document.getElementById("stopwatchStatus");

const StopwatchState = {
    IDLE: "idle",
    RUNNING: "running",
    PAUSED: "paused"
};

let stopwatchState = StopwatchState.IDLE;
let startTime = 0;
let elapsedTime = 0;
let animationId = null;
let lapCounter = 0;

function formatTime(milliseconds) {

    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor(milliseconds % 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

function updateDisplay() {

    stopwatchDisplay.textContent = formatTime(elapsedTime);
}

function stopwatchLoop() {

    elapsedTime = performance.now() - startTime;
    updateDisplay();
    animationId = requestAnimationFrame(stopwatchLoop);
}

function updateStatus() {

    stopwatchStatus.className = "status-badge";
    switch (stopwatchState) {
        case StopwatchState.IDLE:
            stopwatchStatus.textContent = "Ready";
            stopwatchStatus.classList.add("status-info");
            break;
        case StopwatchState.RUNNING:
            stopwatchStatus.textContent = "Running";
            stopwatchStatus.classList.add("status-success");
            break;
        case StopwatchState.PAUSED:
            stopwatchStatus.textContent = "Paused";
            stopwatchStatus.classList.add("status-warning");
            break;
    }
}

function updateButtons() {

    switch (stopwatchState) {
        case StopwatchState.IDLE:
            startButton.textContent = "Start";
            lapButton.style.display = "none";
            lapButton.disabled = true;
            resetButton.style.display = "none";
            resetButton.disabled = true;
            break;
        case StopwatchState.RUNNING:
            startButton.textContent = "Pause";
            lapButton.style.display = "inline-block";
            lapButton.disabled = false;
            resetButton.style.display = "none";
            resetButton.disabled = true;
            break;
        case StopwatchState.PAUSED:
            startButton.textContent = "Resume";
            lapButton.style.display = "none";
            lapButton.disabled = true;
            resetButton.style.display = "inline-block";
            resetButton.disabled = false;
            break;
    }
    updateStatus();
}

function startStopwatch() {

    startTime = performance.now() - elapsedTime;
    stopwatchState = StopwatchState.RUNNING;
    updateButtons();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(stopwatchLoop);
}

function pauseStopwatch() {

    cancelAnimationFrame(animationId);
    animationId = null;
    stopwatchState = StopwatchState.PAUSED;
    updateButtons();
}

function resetStopwatch() {

    cancelAnimationFrame(animationId);
    animationId = null;
    elapsedTime = 0;
    lapCounter = 0;
    lapList.innerHTML = "";
    stopwatchState = StopwatchState.IDLE;
    updateDisplay();
    updateButtons();
}

function addLap() {

    lapCounter++;
    const lap = document.createElement("div");
    lap.className = "lap-item";
    const title = document.createElement("span");
    title.textContent = `Lap ${lapCounter}`;
    const time = document.createElement("span");
    time.textContent = formatTime(elapsedTime);
    lap.append(title, time);
    lapList.prepend(lap);
}

startButton.addEventListener("click", () => {

    switch (stopwatchState) {
        case StopwatchState.IDLE:
            startStopwatch();
            break;
        case StopwatchState.RUNNING:
            pauseStopwatch();
            break;
        case StopwatchState.PAUSED:
            startStopwatch();
            break;
    }
});

lapButton.addEventListener("click", addLap);
resetButton.addEventListener("click", resetStopwatch);

updateDisplay();
updateButtons();