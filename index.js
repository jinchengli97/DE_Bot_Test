require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { BotFrameworkAdapter } = require("botbuilder");

const app = express();
const PORT = process.env.PORT || 3978;

// Disable authentication for local testing
const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID || "", // Empty for local testing
  appPassword: process.env.MICROSOFT_APP_PASSWORD || "", // Empty for local testing
});

// Handle incoming messages
const botLogic = async (context) => {
  if (context.activity.type === "message") {
    const userMessage = context.activity.text;

    try {
      // Call the echo API
      const response = await axios.post("https://postman-echo.com/post", { message: userMessage });

      // Extract the echoed message
      const echoedMessage = response.data.data.message;

      // Send back the echoed message
      await context.sendActivity(`API Response: ${echoedMessage}`);
    } catch (error) {
      console.error("Error calling API:", error);
      await context.sendActivity("Sorry, I couldn't reach the API.");
    }
  }
};

// Listen for incoming messages
app.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await botLogic(context);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Bot is running on http://localhost:${PORT}/api/messages`);
});
