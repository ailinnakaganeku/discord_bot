import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

/* client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  return message.reply(`${message.content}`);
}); Working ✅ */

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant who responds succinctly.",
        },
        { role: "user", content: message.content },
      ],
    });

    const content = data.choices[0].message;
    message.reply(content);
  } catch (err) {
    console.error(err);
    message.reply("As an AI robot, I made an error.");
  }
});

client.login(process.env.BOT_TOKEN);
