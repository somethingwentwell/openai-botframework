// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');

const { ActivityHandler, MessageFactory } = require('botbuilder');
let fetch;
if (parseInt(process.versions.node.split('.')[0]) >= 14) {
  fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
} else {
  fetch = require('node-fetch');
}

const dotenv = require('dotenv');
// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });


class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            const requestBody = {
                "id": context.activity.recipient.id,
                "text": context.activity.text
            };
            console.log(requestBody)
            const apiUrl = process.env.LC_API_URL;
            const headers = {
                'Content-Type': 'application/json'
            };

            // Call the OpenAI API to generate a response
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
            });
            const res = await response.json();
            console.log(res)
            const replyText = res.result.trim();

            // Send the response back to the user
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'This is a bot that uses OpenAI to generate responses. Source code: https://github.com/somethingwentwell/openai-tgbot';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;