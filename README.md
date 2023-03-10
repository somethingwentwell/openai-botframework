# Teams Chatbot using OpenAI's GPT-3

This is a Teams chatbot that uses Azure OpenAI's GPT-3 to generate responses to user messages.

## Prerequisites

To run this chatbot, you will need the following:

- Node.js and npm installed on your machine.

## Installation

1. Clone this repository to your local machine.

2. Install dependencies by running:
```
npm install
```

3. Set up the environment variables in a `.env` file. You can copy the `.env.example` file and rename it to `.env`, then replace the placeholders with your own API key and bot token.

Example .env:
```
MicrosoftAppType=MultiTenant
MicrosoftAppId=<Your MicrosoftAppId>
MicrosoftAppPassword=<Your MicrosoftAppPassword>
MicrosoftAppTenantId=<Your MicrosoftAppTenantId>

OPENAI_NAME=<Your OPENAI_NAME>
OPENAI_API_KEY=<Your OPENAI_API_KEY>
ENGINE=gpt-35-turbo

OPENAI_API_TYPE=azure
OPENAI_API_VERSION=2022-12-01

MAX_DIALOGUES=10
MAX_TOKENS=400
TEMPERATURE=1
FREQUENCY_PENALTY=0
PRESENCE_PENALTY=0
TOP_P=0.95
STOP='["<|im_end|>"]'
PREPROMPT='You are a Office365 support assistant. You help the user to answer all Office365 related questions. You write in a friendly yet professional tone. If the question is not about Office365, respond by saying "I am sorry that I can only able to answer Office 365 related questions”'
```

Make sure to keep the `.env` file private and do not commit it to version control.

## Usage

1. Start the bot by running the following command:
```
npm start
```
or in Docker
```
docker build -t openai-teams-bot .
docker run -d -p 3978:3978 --env-file .env openai-teams-bot
```

2. Set the Message Endpoint in Azure Bot configuration

3. Enable the Teams Channel
![](img/teamschannel.png)


4. Click "Open in Teams" then send a message to your bot in Teams, and it should respond with a generated message
![](img/openinteams.png)

## Reference

For local testing in Teams channel, you can expose your localhost and set the exposed endpoint. For example:
```
npx localtunnel --port 3978
```

To retrieve the MicrosoftAppId and MicrosoftAppPassword, you can create a new Azure Bot Service: https://portal.azure.com/#create/Microsoft.AzureBot"

MicrosoftAppId and MicrosoftAppPassword can be found from the Azure Bot Service configuration page.
![](img/appid_pw.png)

## Contributing

If you'd like to contribute to this project, please open an issue or pull request on GitHub.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

