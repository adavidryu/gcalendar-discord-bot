# Discord Google Calendar Bot 🤖 📅

A powerful Discord integration that allows server members to manage Google Calendar events directly through Discord commands. This bot streamlines event planning by providing intuitive commands to create, view, and delete calendar events without leaving your Discord server. 4-5x faster than manual event management within native Google Calendar.

## 📋 Features

- **Create Events**: Add new events to your Google Calendar with detailed information
- **Delete Events**: Remove events from your calendar using a simple command
- **User-Friendly Interface**: Easy-to-use commands with helpful feedback
- **Secure Authentication**: Uses Google Service Account for secure API access
- **Timezone Support**: Events are created in your specified timezone

## 🔧 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/discord-google-calendar-bot.git
   cd discord-google-calendar-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up a Discord bot in the [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Navigate to the "Bot" tab and click "Add Bot"
   - Under "Privileged Gateway Intents", enable:
     - Server Members Intent
     - Message Content Intent
   - Copy your bot token for the next step

4. Set up a Google Service Account:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select an existing one)
   - Enable the Google Calendar API
   - Create a Service Account under "IAM & Admin" > "Service Accounts"
   - Generate and download a JSON key file
   - Share your Google Calendar with the service account email address

5. Create a `.env` file in the root directory with the following variables:
   ```
   BOT_TOKEN=your_discord_bot_token
   GOOGLE_SERVICE_ACCOUNT=./path/to/your-service-account-key.json
   CALENDAR_ID=your_google_calendar_id@group.calendar.google.com
   ```

6. Start the bot:
   ```bash
   node index.js
   ```

## 📚 Command Reference

| Command | Description | Format | Example |
|---------|-------------|--------|---------|
| `/ev help` | Display all available commands | `/ev help` | `/ev help` |
| `/ev create` | Add a new event to the calendar | `/ev create; Event Name; YYYY-MM-DD; HH:MM; Location` | `/ev create; Team Meeting; 2025-03-20; 14:30; Zoom` |
| `/ev delete` | Remove an event from the calendar | `/ev delete; Event Name` | `/ev delete; Team Meeting` |

## 🔍 Command Details

### Creating Events

To create a new event, use the `/ev create` command with the following parameters separated by semicolons:
1. Event name
2. Date (YYYY-MM-DD format)
3. Time (HH:MM in 24-hour format)
4. Location

Example:
```
/ev create; Monthly Planning; 2025-04-15; 09:00; Conference Room A
```

### Deleting Events

To delete an event, use the `/ev delete` command followed by the event name:
```
/ev delete; Monthly Planning
```
The search is case-insensitive for your convenience.

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `BOT_TOKEN` | Your Discord bot token from the Discord Developer Portal |
| `GOOGLE_SERVICE_ACCOUNT` | Path to your Google Service Account key JSON file |
| `CALENDAR_ID` | The ID of your Google Calendar |

## 🔒 Permissions

The bot requires the following Discord permissions:
- Read Messages/View Channels
- Send Messages
- Read Message History

## 🛠️ Troubleshooting

**Bot doesn't respond to commands:**
- Ensure the bot has the necessary permissions in your Discord server
- Check that you've enabled the required Gateway Intents in the Discord Developer Portal
- Verify that your `.env` file contains the correct token

**Calendar events aren't being created:**
- Confirm that your service account has access to the calendar
- Check the console for API error messages
- Verify the format of your command is correct

## 📈 Future Enhancements

- Natural language processing for avoiding strict command formatting
- List upcoming events from the calendar
- Support for recurring events
- Event reminders and notifications
- Interactive event creation with Discord buttons

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [Discord.js](https://discord.js.org/) for the Discord API integration
- [Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client) for the Google Calendar integration

---

Made with ❤️ by Adam Ryu