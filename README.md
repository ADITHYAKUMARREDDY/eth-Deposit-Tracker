# Ethereum Deposit Tracker - Backend

The backend for the Ethereum Deposit Tracker is a Node.js application that tracks ETH deposits to the Beacon Deposit Contract, logs transaction details, and can send notifications via Telegram. This backend is responsible for interacting with the Ethereum blockchain, saving deposit data into MongoDB, and optionally alerting users of new deposits.

---

## Features

- **Real-time Deposit Tracking**: Continuously monitors the Ethereum blockchain for new ETH deposits.
- **MongoDB Integration**: Stores deposit details such as block number, transaction hash, and more in a MongoDB database.
- **Error Handling & Logging**: Implements Winston for logging errors and other important events.
- **Optional Notifications**: Sends Telegram notifications for new deposits.
- **REST API**: Provides API endpoints to fetch deposit data.

---

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building APIs.
- **Mongoose**: MongoDB object modeling tool to work with deposit data.
- **Alchemy SDK**: For interacting with Ethereum blockchain data.
- **Winston**: Logging library.
- **Node-Telegram-Bot-API**: For sending Telegram notifications.
- **MongoDB**: NoSQL database for storing deposit information.

---

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MongoDB**: [Download MongoDB](https://www.mongodb.com/try/download/community)
- **Alchemy Account**: [Sign up for Alchemy](https://alchemy.com/) to obtain an API key.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ethereum-deposit-tracker.git
   cd ethereum-deposit-tracker/backend

   install dependencies:

      npm install express mongoose dotenv cors winston alchemy-sdk node-telegram-bot-api
      npm i

 .env file:

# Alchemy API key for Ethereum RPC
ALCHEMY_API_KEY=your-alchemy-api-key

# MongoDB connection URI
MONGODB_URI=mongodb://localhost:27017/ethdata

# Telegram bot token and chat ID for notifications
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Server port
PORT=5000


to run backend ------   node index.js





API Endpoints
GET /api/deposits

    Description: Fetches all deposit records from the MongoDB database.
    Response:

    json

    [
      {
        "blockNumber": "12345678",
        "blockTimestamp": "2023-09-10T10:15:00Z",
        "fee": "0.01 ETH",
        "hash": "0xabc123...",
        "pubkey": "0xpubkey..."
      },
      ...
    ]

POST /api/deposits

    Description: Manually add a deposit record to MongoDB (for testing purposes).
    Body:

    json

    {
      "blockNumber": "12345678",
      "blockTimestamp": "2023-09-10T10:15:00Z",
      "fee": "0.01 ETH",
      "hash": "0xabc123...",
      "pubkey": "0xpubkey..."
    }

How It Works
1. Tracking Deposits

The backend connects to the Ethereum blockchain using Alchemy SDK and monitors for new transactions to the Beacon Deposit Contract address (0x00000000219ab540356cBB839Cbe05303d7705Fa). Each time a new block is mined, the backend checks for ETH deposits and records the relevant details in MongoDB.
2. Storing Deposit Data

Each deposit record is saved with the following schema:

json

{
  "blockNumber": "Number",
  "blockTimestamp": "Date",
  "fee": "String",
  "hash": "String",
  "pubkey": "String"
}

3. Logging and Error Handling

Winston is used to log important events such as successful deposits, errors, and warnings. Logs are stored in a file and printed to the console.
4. Telegram Notifications

When a new deposit is detected, the backend sends a notification to a specified Telegram chat. The bot is configured using the node-telegram-bot-api package.
Setting Up Telegram Bot

    Create the Telegram Bot:
        Open Telegram and search for @BotFather.
        Send /newbot to create a new bot and follow the instructions.
        Copy the bot token and paste it into your .env file under TELEGRAM_BOT_TOKEN.

    Get Chat ID:
        Start a chat with your bot and send a message.
        Use the following API to get your chat ID:

        bash

        https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates

        Look for "chat": { "id": <chat_id> } in the response and add it to your .env file under TELEGRAM_CHAT_ID.

Logging

The application logs important events using Winston. Logs are stored in a file and printed to the console for easy debugging.

Contributing

    Fork the repository.
    Create a new feature branch (git checkout -b feature-branch).
    Commit your changes (git commit -m 'Add some feature').
    Push to the branch (git push origin feature-branch).
    Open a Pull Request.

License

This project is licensed under the MIT License - see the LICENSE file for details.
Authors

    GOPAVARAM ADITHYA KUMAR REDDY

    portfoili0:https://www.crio.do/learn/portfolio/kumaradithya498/
    resume: https://drive.google.com/file/d/1NIy30IxynuFWTmirZ43hPKoaPGJBEhgf/view?usp=drivesdk

Acknowledgments

    Special thanks to the developers of Alchemy, Mongoose, and Telegram Bot API for their amazing tools and libraries.

markdown


### Explanation of the Sections:

1. **Features**: Overview of the application's core functionality.
2. **Technologies Used**: Lists the main technologies and libraries used in the project.
3. **Prerequisites**: Details on what needs to be installed before running the application.
4. **Installation**: Step-by-step guide to clone, configure, and run the project.
5. **API Endpoints**: Lists the REST API endpoints provided by the backend.
6. **How It Works**: Explanation of key functionalities like deposit tracking, logging, and Telegram notifications.
7. **Setting Up Telegram Bot**: Detailed instructions on setting up the Telegram bot for notifications.
8. **Docker Support**: Optional instructions for running the application in Docker.
9. **Contributing**: Guide on how to contribute to the project.
10. **License & Authors**: Information about licensing and authorship.

This structured README will give any user a comprehensive understanding of your project and how to get started.
