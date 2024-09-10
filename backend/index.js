const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const winston = require("winston");
const { Network, Alchemy } = require("alchemy-sdk");
const TelegramBot = require("node-telegram-bot-api");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up Winston for logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/ethdata")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => logger.error("MongoDB connection error", err));

// Define deposit schema and model
const depositSchema = new mongoose.Schema(
  {
    blockNumber: Number,
    blockTimestamp: Date,
    fee: String,
    hash: String,
    pubkey: String,
  },
  { collection: "deposits" }
);

const Deposit = mongoose.model("Deposit", depositSchema, "deposits");

// Set up Alchemy SDK
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const chatId = process.env.TELEGRAM_CHAT_ID; // Ensure this is set in your .env file

// Function to send a message to Telegram with your full name
const sendTelegramMessage = (message) => {
  const messageWithSignature = `${message}\n\n- Adithya Kumar Reddy`;
  bot.sendMessage(chatId, messageWithSignature);
};

// Global variable to track the last processed block
let lastProcessedBlock = 0;

// Function to track deposits on the Beacon Deposit Contract
const trackDeposits = async () => {
  try {
    const contractAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

    // Get the latest block number from Alchemy
    const latestBlockNumber = await alchemy.core.getBlockNumber();

    // Initialize lastProcessedBlock if this is the first run
    if (lastProcessedBlock === 0) {
      lastProcessedBlock = latestBlockNumber - 1;
    }

    // Loop through unprocessed blocks
    for (
      let currentBlock = lastProcessedBlock + 1;
      currentBlock <= latestBlockNumber;
      currentBlock++
    ) {
      // Fetch block details and transactions
      const blockDetails = await alchemy.core.getBlockWithTransactions(
        currentBlock
      );
      const transactions = blockDetails.transactions;

      // Filter transactions related to the contract address
      const deposits = transactions.filter(
        (tx) => tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()
      );
      console.log(deposits, "matched");
      // Process each deposit
      for (const deposit of deposits) {
        const newDeposit = new Deposit({
          blockNumber: currentBlock,
          blockTimestamp: new Date(blockDetails.timestamp * 1000),
          fee: deposit.gasPrice.toString(),
          hash: deposit.hash,
          pubkey: deposit.input, // Assuming pubkey is stored in input data
        });

        // Save deposit to database
        try {
          await newDeposit.save();
          const message = `New deposit detected!\nBlock Number: ${currentBlock}\nTimestamp: ${new Date(
            blockDetails.timestamp * 1000
          )}\nTransaction Hash: ${deposit.hash}\nGas Fee: ${
            deposit.gasPrice
          }\nPubkey: ${deposit.input}`;
          console.log(message);
          logger.info(`New deposit saved: ${deposit.hash}`);
          sendTelegramMessage(message);
        } catch (saveError) {
          logger.error("Error saving deposit to database:", saveError);
        }
      }

      // Update last processed block
      lastProcessedBlock = currentBlock;
    }
  } catch (error) {
    logger.error("Error tracking deposits:", error);
  }
};

// Periodically check for new deposits (every 5 seconds)
setInterval(trackDeposits, 5 * 1000);

// Express route to get all deposits
app.get("/api/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find();
    res.json(deposits);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Express route to create a new deposit manually (for testing)
app.post("/api/deposits", async (req, res) => {
  const { blockNumber, blockTimestamp, fee, hash, pubkey } = req.body;

  try {
    const newDeposit = new Deposit({
      blockNumber,
      blockTimestamp,
      fee,
      hash,
      pubkey,
    });
    await newDeposit.save();
    res.json(newDeposit);
    logger.info(`Manual deposit added: ${hash}`);
  } catch (error) {
    logger.error("Error adding manual deposit:", error);
    res.status(500).send("Server error");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
