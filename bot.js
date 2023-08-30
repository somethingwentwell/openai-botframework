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

var currentCustomers = {};

queryCRMCustomerName = async (message, recipient) => {
    let requestBody = {
        "inputs": {"input":message},
        "session_id": recipient
    }
    let headers = {
        'Content-Type': 'application/json'
    };
    console.log(requestBody)
    let apiUrl = process.env.QUERY_CRM_URL;
    let response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
    });
    let res = await response.json();
    console.log(res)
    let replyText = res.result.function.name;
    
    if (replyText.toLowerCase().includes("powerpoint") || replyText.toLowerCase() == "none") {
        replyText = "";
    }
    // Send the response back to the user
    return replyText;
}

hardcodedCRMAPICall = (name) => {
    if (name == "Chan Tai Man") {
        return {
            "name": "Chan Tai Man",
            "portfolio": {
                "cash": 1000000,
                "stock": 1000000,
                "bond": 1000000
            }
        }
    }
    if (name == "Chan Siu Ming") {
        return {
            "name": "Chan Siu Ming",
            "portfolio": {
                "cash": 2000000,
                "stock": 3000000,
                "bond": 4000000
            }
        }
    }
    return {
        "Error": "Customer not found"
    }
}

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            // const requestBody = {
            //     "id": context.activity.recipient.id,
            //     "text": context.activity.text
            // };
            var requestBody = {
                "inputs": {"input":context.activity.text},
                "session_id": context.activity.recipient.id
            }
            console.log(requestBody)
            var apiUrl = process.env.INTENT_IDENTIFY_URL;
            var headers = {
                'Content-Type': 'application/json'
            };

            // Call the OpenAI API to generate a response
            var response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
            });
            var res = await response.json();
            console.log(res)
            var replyText = res.result.function.intent;

            // Send the response back to the user
            await context.sendActivity(MessageFactory.text("Intent: " + replyText, "Intent: " + replyText));

            let customerName = "";
            let validCustomer = {};
            switch (replyText) {

                case "casual_chat":
                    requestBody = {
                        "inputs": {"input":context.activity.text},
                        "session_id": context.activity.recipient.id
                    }
                    console.log(requestBody)
                    apiUrl = process.env.CASUAL_CHAT_URL;
                    response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(requestBody),
                    });
                    res = await response.json();
                    console.log(res)
                    replyText = res.result.text;
                    // Send the response back to the user
                    await context.sendActivity(MessageFactory.text(replyText, replyText));
                    break;
                case "query_crm":
                    await context.sendActivity(MessageFactory.text("Queuing CRM..."));
                    customerName = await queryCRMCustomerName(context.activity.text, context.activity.recipient.id);
                    validCustomer = hardcodedCRMAPICall(customerName);
                    if (validCustomer.name != "") {
                        currentCustomers[context.activity.recipient.id] = validCustomer;
                        await context.sendActivity(MessageFactory.text(JSON.stringify(validCustomer), JSON.stringify(validCustomer)));
                    }
                    else {
                        validCustomer = {};
                        currentCustomers[context.activity.recipient.id] = {};
                        await context.sendActivity(MessageFactory.text("No customer found.", "No customer found."));
                    }
                    break;
                case "generate_powerpoint":
                    if (!currentCustomers[context.activity.recipient.id]) {
                        customerName = await queryCRMCustomerName(context.activity.text, context.activity.recipient.id);
                        validCustomer = hardcodedCRMAPICall(customerName);
                        if (validCustomer.name) {
                            currentCustomers[context.activity.recipient.id] = validCustomer;
                        }
                        else {
                            currentCustomers[context.activity.recipient.id] = {};
                        }
                    }
                    if (currentCustomers[context.activity.recipient.id].name) {
                        await context.sendActivity(MessageFactory.text("Generating powerpoint for " + currentCustomers[context.activity.recipient.id].name, "Generating powerpoint for " + currentCustomers[context.activity.recipient.id].name));
                        await context.sendActivity(MessageFactory.text("[Complete the generate PowerPoint Function]", "[Complete the generate PowerPoint Function]"));
                    }
                    else {
                        await context.sendActivity(MessageFactory.text("No customer name in record, please find a valid customer first.", "No customer name in record, please find a valid customer first."));
                    }
                    break;
                default:
                    await context.sendActivity(MessageFactory.text("Sorry, I don't understand."));
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'This is a bot that uses OpenAI to complete your daily tasks. Current tasks include: \n\n' + '1. Find Customer Information\n' + '2. Generate Powerpoint';
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