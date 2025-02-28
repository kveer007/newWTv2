let goal = 0;
let totalIntake = 0;
let reminderInterval = null;
let dailyHistory = JSON.parse(localStorage.getItem("dailyHistory")) || {};
let previousIntake = JSON.parse(localStorage.getItem("previousIntake")) || [];

function saveDailyHistory(amount) {
    let currentDate = new Date().toLocaleDateString();
    if (!dailyHistory[currentDate]) {
        dailyHistory[currentDate] = [];
    }
    dailyHistory[currentDate].push(amount);
    localStorage.setItem("dailyHistory", JSON.stringify(dailyHistory));
}

function toggleHistory() {
    let history = document.getElementById("history-popup");
    let settings = document.getElementById("settings-section");

    if (settings.style.display === "block") {
        settings.style.display = "none"; // Close settings if open
    }

    history.style.display = history.style.display === "none" ? "block" : "none";
}

function showHistory() {
    let historyData = "<h2>Daily Water Intake History</h2>";
    
    // Get the last 7 days sorted in descending order
    let dates = Object.keys(dailyHistory)
        .sort((a, b) => new Date(b) - new Date(a))
        .slice(0, 7);

    // Build history display
    for (let date of dates) {
        historyData += `<p><b>${date}:</b> ${dailyHistory[date].reduce((a, b) => a + b, 0)} ml</p>`;
    }

    document.getElementById("history-content").innerHTML = historyData;
}

function setGoal() {
    goal = parseInt(document.getElementById("goal").value);
    document.getElementById("remaining").innerText = goal;
    localStorage.setItem("waterGoal", goal);
    updateProgressBar();
}

function addWater(amount) {
    totalIntake += amount;
    saveDailyHistory(amount); // Save to history
    updateDisplay();
    showHistory(); // Update history immediately
}

function addManual() {
    let amount = parseInt(document.getElementById("manual").value);
    if (!isNaN(amount)) {
        totalIntake += amount;
        saveDailyHistory(amount); // Save to history
        updateDisplay();
        showHistory(); // Update history immediately
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

        // Show immediate notification to confirm it's set
        new Notification("Reminder set! You'll get notified every " + time + " minutes between 8 AM - 10 PM.");

        reminderInterval = setInterval(() => {
            let currentHour = new Date().getHours(); // Get current hour (0-23)

            if (currentHour >= 8 && currentHour <= 23) { // Between 8 AM and 11 PM
                new Notification("Time to drink water!");
            }
        }, time * 60 * 1000);

        localStorage.setItem("reminderTime", time);
    }
}

// Enable Notifications
function enableNotifications() {
    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                alert("Notifications enabled! Now set a reminder.");
            } else {
                alert("Notifications are blocked. Enable them in browser settings.");
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
        
// Reset only today's history
        if (dailyHistory[currentDate]) {
            dailyHistory[currentDate] = [];
            localStorage.setItem("dailyHistory", JSON.stringify(dailyHistory));
        }
        
        alert("All data has been reset!");
    }
}

function checkAndResetDailyIntake() {
    let now = new Date();
    let currentDate = now.toLocaleDateString();
    let currentHour = now.getHours();
    let currentMinutes = now.getMinutes();
    
    let lastResetDate = localStorage.getItem("lastResetDate");
    
    if (currentHour === 1 && currentMinutes === 0 && lastResetDate !== currentDate) {
        resetDailyIntake();
        localStorage.setItem("lastResetDate", currentDate);
    }
}

function resetDailyIntake() {
    let currentDate = new Date().toLocaleDateString();
    
    if (dailyHistory[currentDate]) {
        dailyHistory[currentDate] = [];
        localStorage.setItem("dailyHistory", JSON.stringify(dailyHistory));
    }
    
    totalIntake = 0;
    updateDisplay();
    showHistory();
}

setInterval(checkAndResetDailyIntake, 60000);

// Toggle Settings Visibility
function toggleSettings() {
    let settings = document.getElementById("settings-section");
    let history = document.getElementById("history-popup");

    if (history.style.display === "block") {
        history.style.display = "none"; // Close history if open
    }

    settings.style.display = settings.style.display === "none" ? "block" : "none";
}

document.addEventListener("click", function(event) {
    let settings = document.getElementById("settings-section");
    let history = document.getElementById("history-popup");

    if (!event.target.closest(".settings, .settings-btn")) {
        settings.style.display = "none";
    }

    if (!event.target.closest(".history-popup, .history-btn")) {
        history.style.display = "none";
    }
});

