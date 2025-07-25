# 📬 Email Automation System (Secure with Human-in-the-Loop)

This is a secure, modular email automation workflow built using [n8n](https://n8n.io). It uses structured inputs, strict authentication, and human approvals to ensure no unsupervised AI actions take place. It is designed to generate templated emails based on predefined actions like `send_summary`, and routes output to a human reviewer (e.g., via Slack) before any email is sent.

---

## 🔐 Key Security Features

- **Webhook Authentication**: Incoming requests must provide a valid token using the `x-auth-token` header, validated via n8n credentials.
- **Structured Input Format**: All requests must use a structured schema like:
  ```json
  {
    "action": "send_summary",
    "userId": "user456"
  }
AI Content Generation Only: AI is used only to generate content. It has no direct control over sending emails.

Human-in-the-Loop: Generated content is sent to a Slack channel for manual approval or further routing.

Predefined Logic Only: Only whitelisted actions (send_summary) are accepted. Others are rejected.

🚀 Workflow Overview
Webhook Trigger

Endpoint: /secure-email-request

Method: POST

Requires: x-auth-token in headers

Token Auth Check

Authenticates the request using n8n credentials (via secureTokenAuth).

Action Validator

Ensures the action is predefined (e.g., send_summary).

Extracts userId.

AI Email Generator (Jarvis Agent)

Generates structured email content using predefined templates and instructions.

Slack Integration

Forwards the AI-generated summary to a Slack channel (e.g. #approvals) for human review.

Webhook Response

Responds with a JSON message indicating the content has been routed for approval.

🧪 Example Request
bash
Copy
Edit
curl -X POST https://your-n8n-domain.com/webhook/secure-email-request \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_SECURE_TOKEN" \
  -d '{
    "action": "send_summary",
    "userId": "user456"
  }'
📦 Setup Instructions
Import the workflow into your n8n instance.

Create a credential of type secureTokenAuth with a valid token (used for validating x-auth-token).

Configure Slack:

Add Slack API credentials in n8n.

Set the Slack channel (e.g., #approvals) in the Slack node.

(Optional) Extend workflow to send emails after Slack approval (not enabled by default for safety).

🔄 Extending the System
To support more actions (e.g., compose_reply, notify_manager):

Add the new action to the allowedActions array in the Validate Action node.

Define new AI prompts or templates accordingly.

Route the result to Slack or another approval mechanism.
