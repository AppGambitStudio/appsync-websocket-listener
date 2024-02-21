# appsync-websocket-listener

AWS AppSync WebSocket NodeJs Listener

# Usecase

We have a MEAN-stack application running on on-prem infrastructure. The application pushes some of the task off to AWS environment where we use API Gateway, Lambda functions, DynamoDB, Step Functions, etc. Once the task is completed, we needed to push the task update back to on-prem application. We tried following options and in the end settled with AWS IoT Core with MQTT. Yes, this example worked fine in our testing, but we already fixed the communication using IoT Core and MQTT endpoint. The agenda was to use Serverless and cost-efficient services to exchange information in real time.

## Other solutions

- **Google Cloud Pub/Sub**: Works great, but slightly costly and required additional operational and management overhead. We wanted to keep everything in AWS Account.
- **IoT Core MQTT Endpoint**: This option WORKS as expected and met our requirements. The only downside was to create the Device x509 Certificates to configure the listener. In our case, the software will only have one listener per-environment, and the feature was an add-on, so creating a unique listener was not an issue. In case of Google Pub/Sub we were already creating the credential JSON file per environment.
- **AppSync Generic Pub/Sub**: This option also WORKED. We use API Gateway and AppSync across many of our applications and we wanted to try this for some time. This keeps the overall services to minimal and easy to integrate.

# Documentation

This repo is primarily intended to build an on-prem listener for messages originating from AWS account. To keep the listener simple and serverless we used AppSync Generic Pub/Sub to exchange messages.

Please refer to this documentation for more detail.

- https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-create-generic-api-serverless-websocket.html
- https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html

# Setup

Please create a `.env` file and save the `APPSYNC_ENDPOINT_ID` and `APPSYNC_KEY_ID`. You will be able to extract this information from AWS AppSync console or Cloudformation output.

This will use the default channel name as `robots`.

```bash
npm i
node index.js
```

You can pass the channel name using the environment variable.

```
CHANNEL=test node index.js
```

# Publish structure

To ensure subscribers receive the data field, you must include it in the mutation's response selection set. It must be part of the mutation's response for AppSync to send it to subscribers. Here's how it should look:

```graphql
mutation PublishData {
  publish(data: "{\"msg\": \"hello world!\"}", name: "robots") {
    name
    data # Ensure this is included in the response
  }
}
```
