const digitalTime = document.getElementById("digitalTime");
const currentDate = document.getElementById("currentDate");

function updateDigitalClock(now) {

    digitalTime.textContent = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

}

function updateDate(now) {

    currentDate.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function loop() {

    const now = new Date();
    updateAnalogClock(now);
    updateDigitalClock(now);
    updateDate(now);
    requestAnimationFrame(loop);
}

loop();