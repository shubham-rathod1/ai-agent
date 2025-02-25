
## Description

Nest framework TypeScript repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# AI Agent API Documentation

This document provides an overview of the available API endpoints for authentication, agent management, chat functionality, user updates, knowledge base (KB) uploads, and image uploads.

## 🔒 Authorization  
All requests **require an Authorization header** in the form of a **Bearer token**:  
```
Authorization: Bearer <your_token_here>
```

## Base URL  
All endpoints replace `localhost:4000` with:  
🔗 **[https://ai-agent-r139.onrender.com](https://ai-agent-r139.onrender.com)**  

---

## 🛡️ Authentication  

### 🔹 Connect  
**Endpoint:**  
`POST /auth/connect`  
**URL:**  
[https://ai-agent-r139.onrender.com/auth/connect](https://ai-agent-r139.onrender.com/auth/connect)  
**Sample Request:**
```json
{
    "msg": "Sign this message to prove you have access to this wallet in order to sign in to Community. This won't cost you any Gas. Date: 1731058227135",
    "sig": "0xd2bd7283bb1a9a2510a7ba40d117ed2caf1348ec56d2923219e38e8ce3060e637c2c11b85b23e9c4ed8e1ba7046576e815b1fe613b5065e317609d3c457ddf321b",
    "typ": "EVM"
}
```
  
### 🔹 Disconnect  
**Endpoint:**  
`POST /auth/disconnect`  
**URL:**  
[https://ai-agent-r139.onrender.com/auth/disconnect](https://ai-agent-r139.onrender.com/auth/disconnect)  

---

## 🤖 Agent Management  

### 🔹 Create Agent  
**Endpoint:**  
`POST /agent`  
**URL:**  
[https://ai-agent-r139.onrender.com/agent](https://ai-agent-r139.onrender.com/agent)  
**Sample Request:**
```json
{
    "name": "numa-ai1",
    "pic": "this should be url",
    "search_engine_id": "brave",
    "model_id": "openai",
    "token": {
        "tkr": "shr",
        "tCAddress": "0xAadFC7f9807d2D1D0EB41e3A3836294F503Babc3"
    },
    "desc": "some bio with min 150 chr max 500charsome bio...",
    "typ": "productive",
    "persona": "I am a software developer working in the blockchain industry!"
}
```

### 🔹 Update Agent  
**Endpoint:**  
`PUT /agent/{agentId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/agent/{agentId}](https://ai-agent-r139.onrender.com/agent/{agentId})  

### 🔹 Get All Agents  
**Endpoint:**  
`GET /agent`  
**URL:**  
[https://ai-agent-r139.onrender.com/agent](https://ai-agent-r139.onrender.com/agent)  

### 🔹 Get Agent by ID  
**Endpoint:**  
`GET /agent/{agentId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/agent/{agentId}](https://ai-agent-r139.onrender.com/agent/{agentId})  

### 🔹 Get Agents by User  
**Endpoint:**  
`GET /agent/byuid`  
**URL:**  
[https://ai-agent-r139.onrender.com/agent/byuid](https://ai-agent-r139.onrender.com/agent/byuid)  

---

## 💬 Chat Management  

### 🔹 Create Chat Session  
**Endpoint:**  
`POST /chat-session`  
**URL:**  
[https://ai-agent-r139.onrender.com/chat-session](https://ai-agent-r139.onrender.com/chat-session)  
**Sample Request:**
```json
{
    "aId": "f5bb7074-4e15-4321-b225-143d7b43ed91"
}
```

### 🔹 Get All Sessions (by Agent & User)  
**Endpoint:**  
`GET /chat-session?aId={agentId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/chat-session?aId=f5bb7074-4e15-4321-b225-143d7b43ed91](https://ai-agent-r139.onrender.com/chat-session?aId=f5bb7074-4e15-4321-b225-143d7b43ed91)  

### 🔹 Get Chat History by Session  
**Endpoint:**  
`GET /chat-message/{sessionId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/chat-message/{sessionId}](https://ai-agent-r139.onrender.com/chat-message/{sessionId})  

### 🔹 Delete Session History  
**Endpoint:**  
`DELETE /chat-message/{sessionId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/chat-message/{sessionId}](https://ai-agent-r139.onrender.com/chat-message/{sessionId})  

### 🔹 Chat with Agent  
**Endpoint:**  
`POST /chat-message`  
**URL:**  
[https://ai-agent-r139.onrender.com/chat-message](https://ai-agent-r139.onrender.com/chat-message)  
**Sample Request:**
```json
{
    "history": [
        {
            "role": "user",
            "name": "shubham",
            "content": "now add 5 to it."
        },
        {
            "role": "assistant",
            "content": "In the code of honor, numbers can mean many things..."
        },
        {
            "role": "user",
            "name": "shubham",
            "content": "my number will be 2"
        }
    ],
    "pId": 2,
    "cSessionId": "f35fe4f2-92cd-4350-9a56-0286a384d2e8"
}
```

---

## 👤 User Management  

### 🔹 Update User  
**Endpoint:**  
`PUT /users/{userId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/users/{userId}](https://ai-agent-r139.onrender.com/users/{userId})  

---

## 📚 Knowledge Base (KB)  

### 🔹 Upload KB via PDF  
**Endpoint:**  
`POST /upload/kb/file/{agentId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/upload/kb/file/{agentId}](https://ai-agent-r139.onrender.com/upload/kb/file/{agentId})  

### 🔹 Upload KB via URL  
**Endpoint:**  
`POST /upload/kb/url/{agentId}`  
**URL:**  
[https://ai-agent-r139.onrender.com/upload/kb/url/{agentId}](https://ai-agent-r139.onrender.com/upload/kb/url/{agentId})  

---

## 🖼️ Image Upload  

### 🔹 Upload Image  
**Endpoint:**  
`POST /upload/single`  
**URL:**  
[https://ai-agent-r139.onrender.com/upload/single](https://ai-agent-r139.onrender.com/upload/single)  

---

## 📌 Notes  
- **All requests require an Authorization header (Bearer Token).**  
- Replace `{agentId}`, `{sessionId}`, or `{userId}` in URLs with actual IDs.  
- All request bodies should be sent as **JSON** unless specified otherwise.  

🚀 **Enjoy building with AI Agent API!**  
