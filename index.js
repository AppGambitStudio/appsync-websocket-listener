'use client';
import 'dotenv/config'
import WebSocket from 'ws';

let region = 'us-east-1';

let appsyncID = process.env.APPSYNC_ID; 
let apiKey = process.env.APPSYNC_KEY_ID;
let url = `wss://${appsyncID}.appsync-realtime-api.${region}.amazonaws.com/graphql`

console.log(appsyncID, apiKey);

const api_header = {
  host: `${appsyncID}.appsync-api.${region}.amazonaws.com`,
  'x-api-key': apiKey,
};

let ws = new WebSocket(url, ['graphql-ws']);

// payload should be an empty JSON object
const payload = {};

const base64_api_header = btoa(JSON.stringify(api_header));
const base64_payload = btoa(JSON.stringify(payload));

const appsync_url = url + '?header=' + base64_api_header + '&payload=' + base64_payload;

ws = new WebSocket(appsync_url, ['graphql-ws']);

ws.onopen = (e) => {
    console.log('Socket opened');    
    ws.send(JSON.stringify({ type: "connection_init" }));

    let listen = JSON.stringify({
        "id": "1", // change this to UUID
        "type": "start",
        "payload": {
            "variables": {                
            },
            "extensions": {
                "authorization": api_header
            },
            "operationName": null,
            "data": JSON.stringify({ "query": "subscription {\n  subscribe(name: \"robots\") {\n data \n }\n}\n" })
        }
    })
      
    ws.send(listen)
};

ws.onmessage = (e) => {console.log('Msg received', e.data);};
ws.onclose   = (e) => {console.log('Socket closed',   e);};
ws.onerror   = (e) => {console.log('Socket error',    e);};