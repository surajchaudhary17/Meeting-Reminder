const fs = require("fs");
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

async function getUpcomingMeeting() {

    const auth = await authenticate({
        keyfilePath: path.join(__dirname, "credentials.json"),
        scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date();

    // const twoMinutesLater = new Date(
    //     now.getTime() + 2 * 60 * 1000
    // );
    const tenMinutesLater = new Date(
        now.getTime() + 10 * 60 * 1000
    );

    const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: tenMinutesLater.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
    });

    return res.data.items[0];
}

module.exports = {
    getUpcomingMeeting
};