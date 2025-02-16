let goal = 0;
let totalIntake = 0;
let reminderInterval = null;

// Function to set daily goal
function setGoal() {
    goal = parseInt(document.getElementById("goal").value);
    document.getElementById("remaining").innerText = goal;
    localStorage.setItem("waterGoal", goal);
    updateProgressBar();
}

// Function to add water intake
function addWater(amount) {
    totalIntake += amount;
    updateDisplay();
}

// Function to add custom water intake
function addManual() {
    let amount = parseInt(document.getElementById("manual").value);
    if (!isNaN(amount)) {
        totalIntake += amount;
        updateDisplay();
    }
}

// Function to update water intake display
function updateDisplay() {
    document.getElementById("total").innerText = totalIntake;
    document.getElementById("remaining").innerText = Math.max(goal - totalIntake, 0);
    localStorage.setItem("waterIntake", totalIntake);
    updateProgressBar();
}

// Function to update progress bar
function updateProgressBar() {
    let progress = (totalIntake / goal) * 100;
    document.getElementById("progress-bar").style.width = Math.min(progress, 100) + "%";
}

// Function to reset only daily intake at 01:00 AM
function checkAndResetDailyIntake() {
    let lastReset = localStorage.getItem("lastResetDate");
    let currentDate = new Date();
    let currentHour = currentDate.getHours();

    let todayDateString = currentDate.toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)

    // Reset intake if it's a new day and past 01:00 AM
    if (lastReset !== todayDateString && currentHour >= 1) {
        totalIntake = 0;
        localStorage.setItem("waterIntake", 0);
        localStorage.setItem("lastResetDate", todayDateString); // Update last reset date
        updateDisplay();
    }
}

// Function to reset only the daily intake manually
function resetDailyIntake() {
    totalIntake = 0;
    localStorage.setItem("waterIntake", 0);
    updateDisplay();
}

// Function to enable notifications
function enableNotifications() {
    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                alert("Notifications enabled! Now set a reminder.");
            }
        });
    } else {
        alert("Your browser does not support notifications.");
    }
}

// Function to set custom reminders
function setReminder() {
    let time = parseInt(document.getElementById("reminder-time").value);
    if (!isNaN(time) && time > 0) {
        if (reminderInterval) clearInterval(reminderInterval);

        new Notification("Reminder set! You'll get notified every " + time + " minutes.");

        reminderInterval = setInterval(() => {
            let currentHour = new Date().getHours();
            if (currentHour >= 8 && currentHour <= 22) {
                new Notification("Time to drink water!");
            }
        }, time * 60 * 1000);

        localStorage.setItem("reminderTime", time);
    }
}

// Function to reset all data
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

// Function to toggle settings visibility
function toggleSettings() {
    let settings = document.getElementById("settings-section");
    settings.style.display = settings.style.display === "none" ? "block" : "none";
}

// Check and reset intake on page load
window.onload = function () {
    goal = parseInt(localStorage.getItem("waterGoal")) || 0;
    totalIntake = parseInt(localStorage.getItem("waterIntake")) || 0;
    let savedReminderTime = localStorage.getItem("reminderTime");

    if (savedReminderTime) {
        document.getElementById("reminder-time").value = savedReminderTime;
        setReminder();
    }

    checkAndResetDailyIntake(); // Auto reset if needed
    updateDisplay();
};
