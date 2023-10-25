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
            try {
                const requestBodyStr = process.env.REQUEST_BODY.replace("<INPUT>", context.activity.text);
                const requestBody = JSON.parse(requestBodyStr);
                console.log(requestBody)
                const apiUrl = process.env.API_ENDPOINT;
                const headers = {
                    'Content-Type': 'application/json',
                    'api-key': process.env.API_KEY
                };
                // Call the OpenAI API to generate a response
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody),
                });
                let res = await response.json();
                console.log(res)
                for (let key in process.env.OUTPUT.split(".")) {
                    res = res[process.env.OUTPUT.split(".")[key]];
                }
                const replyText = res;
                // Send the response back to the user
                await context.sendActivity(MessageFactory.text(replyText, replyText));
                // By calling next() you ensure that the next BotHandler is run.
                await next();
            }
            catch (err) {
                console.error(`${err}`);
                await context.sendActivity(MessageFactory.text(err));
            }


        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'This is a bot that uses InSource to generate responses.';
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