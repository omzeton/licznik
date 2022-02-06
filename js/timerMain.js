const digits = document.getElementsByClassName("digit");
const buttons = document.getElementsByClassName("control-button");
const popup = document.getElementById("popup");
const toggle = document.getElementById("toggle");

const bg = ["url('./img/restart.svg')", "url('./img/pause.svg')"];

let audio = new Audio("./img/budzik.mp3"),
    intervalId = null,
    isPaused = true,
    bgSwitch = false,
    playAudio = false;

// Set opacity to 1 on load
setTimeout(() => document.body.classList.add("render"), 60);

// Convert minutes to seconds
function toSec(input) {
    return input * 60;
}

// Notification alarm firing function
function audioFunction() {
    if (playAudio) {
        audio.loop = true;
        audio.play();
    } else {
        audio.pause();
        audio.currentTime = 0;
    }
}

function timer(time) {
    isPaused = false;
    toggle.style.backgroundImage = bg[1];
    bgSwitch = false;

    // Reset timer on new time
    clearInterval(intervalId);

    // Set interval
    intervalId = setInterval(function () {
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time - minutes * 60);

        // Convert numbers into this format 00:00
        minutes = minutes.toString();
        seconds = seconds.toString();

        // Add 0 if number is between 0 and 9
        if (minutes.length < 2) {
            minutes = "0" + minutes;
        }
        if (seconds.length < 2) {
            seconds = "0" + seconds;
        }

        // Check if pause button has been clicked
        if (isPaused == false) {
            if (time <= -1) {
                // Ring the alarm
                playAudio = true;
                audioFunction();

                // Set time so it displays 00:00
                time--;
                isPaused = true;

                // Clear interval
                clearInterval(intervalId);

                // Display motivational message upon completion
                popup.style.opacity = "1";
                popup.style.top = "3em";
            } else {
                digits[0].innerHTML = minutes.slice(0, 1);
                digits[1].innerHTML = minutes.slice(1, 2);
                digits[2].innerHTML = seconds.slice(0, 1);
                digits[3].innerHTML = seconds.slice(1, 2);
                time--;
            }
        } else {
            // stop timer
            clearInterval();
        }
    }, 1000);
}

// 15 minutes
buttons[0].addEventListener("click", timer.bind(this, toSec(15)));

// 30 minutes
buttons[1].addEventListener("click", timer.bind(this, toSec(20)));

// 70 minutes
buttons[2].addEventListener("click", timer.bind(this, toSec(70)));

// Pause button
buttons[3].addEventListener("click", function () {
    isPaused = !isPaused;

    // Change bg of pause button
    bgSwitch = !bgSwitch;

    if (bgSwitch) {
        toggle.style.backgroundImage = bg[0];
    } else {
        toggle.style.backgroundImage = bg[1];
    }

    // Display motivational message upon completion
    popup.style.opacity = "0";
    popup.style.top = "5em";

    // Stop the alarm
    playAudio = false;
    audioFunction();
});
