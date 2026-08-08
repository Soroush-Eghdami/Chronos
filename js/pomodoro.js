const pomodoroTimer = document.getElementById("pomodoroTimer");
const pomodoroSession = document.getElementById("pomodoroSession");
const pomodoroStatus = document.getElementById("pomodoroStatus");
const pomodoroStart = document.getElementById("pomodoroStart");
const pomodoroSkip = document.getElementById("pomodoroSkip");
const pomodoroReset = document.getElementById("pomodoroReset");
const completedSessions = document.getElementById("completedSessions");
const pomodoroProgressFill = document.getElementById("pomodoroProgressFill");
const PomodoroState = {
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused"
};

const SessionType = {
    FOCUS: "focus",
    SHORT_BREAK: "shortBreak",
    LONG_BREAK: "longBreak"
};

const DURATIONS = {
    FOCUS: 25 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60
};

let pomodoroState = PomodoroState.READY;
let currentSession = SessionType.FOCUS;
let completedFocusSessions = 0;
let remainingSeconds = DURATIONS.FOCUS;
let startTimestamp = 0;
let pomodoroAnimationId = null;

function formatPomodoroTime(seconds){
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function updatePomodoroDisplay(){
    pomodoroTimer.textContent = formatPomodoroTime(remainingSeconds);
    switch(currentSession){
        case SessionType.FOCUS:
            pomodoroSession.textContent = "Focus Session";
            break;
        case SessionType.SHORT_BREAK:
            pomodoroSession.textContent = "Short Break";
            break;
        case SessionType.LONG_BREAK:
            pomodoroSession.textContent = "Long Break";
            break;
    }
    completedSessions.textContent = completedFocusSessions;
    updatePomodoroProgress(remainingSeconds);
}

function updatePomodoroStatus(){
    pomodoroStatus.className = "status-badge";
    switch(pomodoroState){
        case PomodoroState.READY:
            pomodoroStatus.textContent = "Ready";
            pomodoroStatus.classList.add("status-info");
            break;
        case PomodoroState.RUNNING:
            pomodoroStatus.textContent = "Running";
            pomodoroStatus.classList.add("status-success");
            break;
        case PomodoroState.PAUSED:
            pomodoroStatus.textContent = "Paused";
            pomodoroStatus.classList.add("status-warning");
            break;
    }
}

function updatePomodoroButtons(){
    switch(pomodoroState){
        case PomodoroState.READY:
            pomodoroStart.textContent = "Start";
            break;
        case PomodoroState.RUNNING:
            pomodoroStart.textContent = "Pause";
            break;
        case PomodoroState.PAUSED:
            pomodoroStart.textContent = "Resume";
            break;
    }
}

function getCurrentSessionTotal(){
    switch(currentSession){
        case SessionType.FOCUS:
            return DURATIONS.FOCUS;
        case SessionType.SHORT_BREAK:
            return DURATIONS.SHORT_BREAK;
        case SessionType.LONG_BREAK:
            return DURATIONS.LONG_BREAK;
    }
}

function updatePomodoroProgress(secondsLeft){
    const total = getCurrentSessionTotal();
    const elapsed = total - secondsLeft;
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
    pomodoroProgressFill.style.width = `${percent}%`;
    pomodoroProgressFill.classList.toggle("break", currentSession !== SessionType.FOCUS);
}

function nextSession(){
    if(currentSession === SessionType.FOCUS){
        completedFocusSessions++;
        if(completedFocusSessions % 4 === 0){
            currentSession = SessionType.LONG_BREAK;
            remainingSeconds = DURATIONS.LONG_BREAK;
        }
        else{
            currentSession = SessionType.SHORT_BREAK;
            remainingSeconds = DURATIONS.SHORT_BREAK;
        }
    }
    else{
        currentSession = SessionType.FOCUS;
        remainingSeconds = DURATIONS.FOCUS;
    }
    pomodoroState = PomodoroState.READY;
    updatePomodoroDisplay();
    updatePomodoroButtons();
    updatePomodoroStatus();
}

function pomodoroLoop(){
    const elapsed = Math.floor((performance.now() - startTimestamp) / 1000);
    const secondsLeft = remainingSeconds - elapsed;
    if(secondsLeft <= 0){
        cancelAnimationFrame(pomodoroAnimationId);
        pomodoroAnimationId = null;
        nextSession();
        return;
    }
    pomodoroTimer.textContent = formatPomodoroTime(secondsLeft);
    updatePomodoroProgress(secondsLeft);
    pomodoroAnimationId = requestAnimationFrame(pomodoroLoop);
}

function startPomodoro(){
    startTimestamp = performance.now();
    pomodoroState = PomodoroState.RUNNING;
    updatePomodoroButtons();
    updatePomodoroStatus();
    pomodoroAnimationId = requestAnimationFrame(pomodoroLoop);
}

function pausePomodoro(){
    cancelAnimationFrame(pomodoroAnimationId);
    pomodoroAnimationId = null;
    const elapsed = Math.floor((performance.now() - startTimestamp) / 1000);
    remainingSeconds -= elapsed;
    pomodoroState = PomodoroState.PAUSED;
    updatePomodoroButtons();
    updatePomodoroStatus();
}

function resetPomodoro(){
    cancelAnimationFrame(pomodoroAnimationId);
    pomodoroAnimationId = null;
    currentSession = SessionType.FOCUS;
    remainingSeconds = DURATIONS.FOCUS;
    completedFocusSessions = 0;
    pomodoroState = PomodoroState.READY;
    updatePomodoroDisplay();
    updatePomodoroButtons();
    updatePomodoroStatus();
}

function skipPomodoro(){
    cancelAnimationFrame(pomodoroAnimationId);
    pomodoroAnimationId = null;
    nextSession();
}

pomodoroStart.addEventListener("click", () => {
    switch(pomodoroState){
        case PomodoroState.READY:
            startPomodoro();
            break;
        case PomodoroState.RUNNING:
            pausePomodoro();
            break;
        case PomodoroState.PAUSED:
            startPomodoro();
            break;
    }
});

pomodoroReset.addEventListener("click", resetPomodoro);
pomodoroSkip.addEventListener("click", skipPomodoro);
updatePomodoroDisplay();
updatePomodoroButtons();
updatePomodoroStatus();