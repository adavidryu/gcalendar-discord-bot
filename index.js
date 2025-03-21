require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { google } = require("googleapis");
const fs = require("fs");

// Load auth credentials required to use G services
// 1. Process stored key file through .env file
// 2. Define permissions for making API requests
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT, 
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Initialize Google Calendar API and version, passing in auth from earlier
const calendar = google.calendar({ version: "v3", auth });

// Discord bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Boot up bot with welcome message
client.once("ready", () => {
  console.log("Google Calendar bot is online.");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("/ev help")) {
    return message.reply(
      "**📅 Event Bot Commands:**\n" +
      "✅ **Add an event:**\n" +
      "```/ev add; Event Name; YYYY-MM-DD; HH:MM; Location```\n" +
      "Example: `/ev add; Team Meeting; 2025-03-20; 14:30; Zoom`\n\n" +
      "❌ **Delete an event (case-insensitive):**\n" +
      "```/ev delete; Event Name```\n" +
      "Example: `/ev delete; Team Meeting`\n\n" +
      "🛠 Need help? Just type `/ev help` anytime!"
    );
  }

  if (message.content.startsWith("/ev delete")) {
    try {
      // Extract event name
      const eventName = message.content.replace("/ev delete", "").trim().toLowerCase();
      if (!eventName) {
        return message.reply("❌ Please provide an event name to delete. Example: `!deleteEvent Meeting`");
      }

      // Fetch upcoming events
      const res = await calendar.events.list({
        calendarId: process.env.CALENDAR_ID,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = res.data.items;
      if (!events.length) {
        return message.reply("📅 No upcoming events found.");
      }

      // Find event (case-insensitive)
      const eventToDelete = events.find(event => event.summary.toLowerCase() === eventName);
      if (!eventToDelete) {
        return message.reply(`❌ No event found with name: **${eventName}**`);
      }

      // Delete the event
      await calendar.events.delete({
        calendarId: process.env.CALENDAR_ID,
        eventId: eventToDelete.id,
      });

      message.reply(`✅ Event **"${eventToDelete.summary}"** has been deleted from Google Calendar.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ Error deleting event. Please try again.");
    }
  }

  if (message.content.startsWith("/ev create")) {
    try {
      // Extract event details
      const parts = message.content.split(";");
      if (parts.length < 5) {
        return message.reply("❌ Invalid format! Use: `/ev create; Event Name; YYYY-MM-DD; HH:MM; Location`");
      }

      const eventName = parts[1].trim();
      const eventDate = parts[2].trim();
      const eventTime = parts[3].trim();
      const location = parts[4].trim();

      // Convert date & time
      const startTime = new Date(`${eventDate}T${eventTime}:00`);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1); // Default 1-hour duration

      // Create event in Google Calendar
      const event = {
        summary: eventName,
        location: location,
        start: { dateTime: startTime.toISOString(), timeZone: "America/New_York" },
        end: { dateTime: endTime.toISOString(), timeZone: "America/New_York" },
      };

      const eventResult = await calendar.events.insert({
        calendarId: process.env.CALENDAR_ID,
        resource: event,
      });

      // Send confirmation
      message.reply(`✅ Event added to Google Calendar:\n📅 **${eventName}** on ${eventDate} at ${eventTime}\n📍 **${location}**\n🔗 [View Event](${eventResult.data.htmlLink})`);
    } catch (error) {
      console.error(error);
      message.reply("❌ Error adding event. Check format and try again.");
    }
  }
});

// Run the bot
client.login(process.env.BOT_TOKEN);
