const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const { getUpcomingMeeting } = require("./calendar");

let win;

// Prevent duplicate reminders
let lastReminderId = null;

function createWindow() {

  const { width, height } =
    screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,

    transparent: true,
    frame: false,

    alwaysOnTop: true,
    skipTaskbar: true,

    hasShadow: false,
    focusable: false,
    resizable: false,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Click-through
  win.setIgnoreMouseEvents(true);

  win.loadFile(
    path.join(__dirname, "overlay.html")
  );

  startCalendarWatcher();

  // win.webContents.openDevTools({ mode: 'detach' });
}

async function startCalendarWatcher() {

  // Check every 20 seconds
  setInterval(async () => {

    console.log("Checking calendar...");

    const meeting = await getUpcomingMeeting();

    console.log("Meeting result:", meeting);

    if (!meeting) return;

    // unique ID
    const meetingId =
      meeting.title + meeting.start;

    // prevent duplicates
    if (meetingId === lastReminderId) {
      return;
    }

    lastReminderId = meetingId;

    console.log(
      "Upcoming meeting:",
      meeting.title
    );

    // Send to frontend
    win.webContents.send(
      "meeting-reminder",
      `${meeting.title} in 10 min`
    );

  }, 20000);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});