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
console.log('OPENAI_API_KEY: ' + process.env.OPENAI_API_KEY);
dotenv.config({ path: ENV_FILE });


class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            // Set up the OpenAI API request
            // const prompt = `${process.env.PREPROMPT}\n${context.activity.text}`;
            // const requestBody = {
            //     prompt,
            //     max_tokens: parseInt(process.env.MAX_TOKENS),
            //     temperature: parseInt(process.env.TEMPERATURE),
            //     frequency_penalty: parseInt(process.env.FREQUENCY_PENALTY),
            //     presence_penalty: parseInt(process.env.PRESENCE_PENALTY),
            //     top_p: parseInt(process.env.TOP_P),
            //     best_of: 1,
            //     stop: JSON.parse(process.env.STOP),
            // };
            const prompt = `${process.env.PREPROMPT}\n${context.activity.text}\n\n`;
            const requestBody = {
                prompt,
                max_tokens: parseInt(process.env.MAX_TOKENS),
                temperature: parseInt(process.env.TEMPERATURE),
                frequency_penalty: parseInt(process.env.FREQUENCY_PENALTY),
                presence_penalty: parseInt(process.env.PRESENCE_PENALTY),
                top_p: parseInt(process.env.TOP_P),
                best_of: 1,
                stop: JSON.parse(process.env.STOP).length > 0 ? JSON.parse(process.env.STOP) : null,
            };
            const apiKey = process.env.OPENAI_API_KEY;
            const apiUrl = `https://${process.env.OPENAI_NAME}.openai.azure.com/openai/deployments/${process.env.ENGINE}/completions?api-version=2022-12-01`;
            const headers = {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            };

            // Call the OpenAI API to generate a response
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody),
            });
            const { choices } = await response.json();
            const replyText = choices[0].text.trim();

            // Send the response back to the user
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'This is a bot that uses OpenAI to generate responses. Source code: https://github.com/somethingwentwell/openai-botframework';
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