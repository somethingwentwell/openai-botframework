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

```
MicrosoftAppType=MultiTenant
MicrosoftAppId=
MicrosoftAppPassword=
MicrosoftAppTenantId=

API_ENDPOINT=http://demo.insource.asia/api/v1/process/b2430af0-a8f9-4dba-84ed-be0ac3957f02
REQUEST_BODY='{"inputs": {"query":"<INPUT>"}, "tweaks": { "InSourcePostgresVectorRetriever-J75tm": {"collection_name": "TEST"}, "InSourceAzureChatOpenAI-0qZar": {}, "OpenAIEmbeddings-r8pK5": {}, "RetrievalQA-3WMJc": {}, "CombineDocsChain-1PHKn": {} }}'
OUTPUT='result.result'
```

- API_ENDPOINT: The endpoint of the InSource API. For example, `http://demo.insource.asia/api/v1/process/b2430af0-a8f9-4dba-84ed-be0ac3957f02`
- REQUEST_BODY: The request body of the InSource API. You need to use `<INPUT>` to locate the user input. For example, `{"inputs": {"query":"<INPUT>"}, "tweaks": { "InSourcePostgresVectorRetriever-J75tm": {"collection_name": "TEST"}, "InSourceAzureChatOpenAI-0qZar": {}, "OpenAIEmbeddings-r8pK5": {}, "RetrievalQA-3WMJc": {}, "CombineDocsChain-1PHKn": {} }}`
- OUTPUT: The output value of the InSource API. For example, given the InSource response is 
```
{
    "result": {
        "result": "Hello! How can I help you today?",
        "total_tokens": 0
    },
    "session_id": null
}
```
If you need "Hello! How can I help you today" as the bot reply, the OUTPUT is `result.result`

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

