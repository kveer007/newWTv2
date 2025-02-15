let goal = 0;
let totalIntake = 0;
let reminderInterval = null;

function setGoal() {
    goal = parseInt(document.getElementById("goal").value);
    document.getElementById("remaining").innerText = goal;
    localStorage.setItem("waterGoal", goal);
    updateProgressBar();
}

function addWater(amount) {
    totalIntake += amount;
    updateDisplay();
}

function addManual() {
    let amount = parseInt(document.getElementById("manual").value);
    if (!isNaN(amount)) {
        totalIntake += amount;
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById("total").innerText = totalIntake;
    document.getElementById("remaining").innerText = Math.max(goal - totalIntake, 0);
    localStorage.setItem("waterIntake", totalIntake);
    updateProgressBar();
}

// Progress Bar
function updateProgressBar() {
    let progress = (totalIntake / goal) * 100;
    document.getElementById("progress-bar").style.width = Math.min(progress, 100) + "%";
}

// Save Data Between Refreshes
window.onload = function () {
    goal = parseInt(localStorage.getItem("waterGoal")) || 0;
    totalIntake = parseInt(localStorage.getItem("waterIntake")) || 0;
    let savedReminderTime = localStorage.getItem("reminderTime");

    if (savedReminderTime) {
        document.getElementById("reminder-time").value = savedReminderTime;
        setReminder();
    }

    updateDisplay();
};

// Custom Reminder Setting
function setReminder() {
    let time = parseInt(document.getElementById("reminder-time").value);
    if (!isNaN(time) && time > 0) {
        if (reminderInterval) clearInterval(reminderInterval);
        reminderInterval = setInterval(() => {
            new Notification("Time to drink water!");
        }, time * 60 * 1000);
        localStorage.setItem("reminderTime", time);
    }
}

// Enable Notifications
function enableNotifications() {
    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                alert("Notifications enabled!");
            }
        });
    } else {
        alert("Your browser does not support notifications.");
    }
}

// Reset All Data
function resetData() {
    if (confirm("Are you sure you want to reset all data?")) {
        localStorage.clear();
        totalIntake = 0;
        goal = 0;
        document.getElementById("total").innerText = 0;
        document.getElementById("remaining").innerText = 0;
        document.getElementById("goal").value = "";
        document.getElementById("reminder-time").value = "";
        document.getElementById("progress-bar").style.width = "0%";

        if (reminderInterval) clearInterval(reminderInterval);
        reminderInterval = null;

        alert("All data has been reset!");
    }
}

// Reset Daily Intake Only
function resetDailyIntake() {
    totalIntake = 0;
    updateDisplay();
}

// Toggle Settings Visibility
function toggleSettings() {
    let settings = document.getElementById("settings-section");
    settings.style.display = settings.style.display === "none" ? "block" : "none";
}
