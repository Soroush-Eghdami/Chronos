const pomodoroTimer = document.getElementById("pomodoroTimer");
const pomodoroSession = document.getElementById("pomodoroSession");
const pomodoroStatus = document.getElementById("pomodoroStatus");
const pomodoroStart = document.getElementById("pomodoroStart");
const pomodoroSkip = document.getElementById("pomodoroSkip");
const pomodoroReset = document.getElementById("pomodoroReset");
const completedSessions = document.getElementById("completedSessions");
const pomodoroTomatoes = document.getElementById("pomodoroTomatoes");

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
let pomodoroIntervalId = null;

function formatTime(seconds){
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function updateDisplay(){
    pomodoroTimer.textContent = formatTime(remainingSeconds);
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
    updateTomatoes();
}

function updateStatus(){
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

function updateButtons(){
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

function updateTomatoes(){
    const filled = completedFocusSessions % 4;
    let text = "";
    for(let i = 0; i < 4; i++){
        text += i < filled ? "🍅 " : "○ ";
    }
    pomodoroTomatoes.textContent = text.trim();
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
    updateDisplay();
    updateButtons();
    updateStatus();
}

function startPomodoro(){
    if(pomodoroIntervalId) clearInterval(pomodoroIntervalId);
    pomodoroState = PomodoroState.RUNNING;
    updateButtons();
    updateStatus();
    pomodoroIntervalId = setInterval(() => {
        remainingSeconds--;
        if(remainingSeconds <= 0){
            clearInterval(pomodoroIntervalId);
            pomodoroIntervalId = null;
            remainingSeconds = 0;
            updateDisplay();
            nextSession();
        }
        else{
            updateDisplay();
        }
    }, 1000);
}

function pausePomodoro(){
    clearInterval(pomodoroIntervalId);
    pomodoroIntervalId = null;
    pomodoroState = PomodoroState.PAUSED;
    updateButtons();
    updateStatus();
}

function resetPomodoro(){
    clearInterval(pomodoroIntervalId);
    pomodoroIntervalId = null;
    currentSession = SessionType.FOCUS;
    remainingSeconds = DURATIONS.FOCUS;
    pomodoroState = PomodoroState.READY;
    updateDisplay();
    updateButtons();
    updateStatus();
}

function skipPomodoro(){
    clearInterval(pomodoroIntervalId);
    pomodoroIntervalId = null;
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
updateDisplay();
updateButtons();
updateStatus();