#!/usr/bin/env node

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const baseUrl = process.argv[2] || 'http://localhost:3000';
const endpoint = `${baseUrl}/mcp/http`;

console.log(`MCP Client - connecting to ${endpoint}`);
console.log('Type your messages. Press Ctrl+C to exit.');

const rl = createInterface({ input, output });

async function chat() {
  try {
    const history = [];
    
    while (true) {
      const userMessage = await rl.question('You: ');
      
      history.push({ role: 'user', content: userMessage });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: history,
        }),
      });
      
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(errorText);
        continue;
      }
      
      const data = await response.json();
      const assistantMessage = data.messages[data.messages.length - 1];
      
      console.log(`Assistant: ${assistantMessage.content}`);
      
      history.push(assistantMessage);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

chat();
