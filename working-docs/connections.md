# Connect Robotomail to an AI app

Robotomail gives your agent an email mailbox. The shared MCP connector lets an
AI app list your mailboxes, search and read messages, send plain-text email,
reply in an existing thread, and set the friendly sender name.

**Availability:** Connections are currently an invite-only preview. You need an
enabled Robotomail account and an existing mailbox. Public marketplace listings
are being prepared and have not been approved. Your account plan and normal
sending and receiving limits apply. Contact support@robotomail.com about access.

## Claude

1. Sign in to Robotomail in your browser.
2. Open [Robotomail Connections](https://robotomail.com/connections) and choose
   **Connect in Claude**. You can also use [this custom connector link](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Robotomail&connectorUrl=https%3A%2F%2Frobotomail.com%2Fmcp).
3. Add the connector, choose OAuth authentication if prompted, and authenticate.
4. Review the requested Robotomail permissions and approve only if you initiated
   the connection. An existing Robotomail browser session can be reused.
5. Enable Robotomail in your conversation and ask it to list your mailboxes.

A public OAuth client can show a client authentication method of `none`. That
means no shared client secret; it does not mean anonymous access to your mail.
If Claude detects the server as unauthenticated, refresh the setup and choose
OAuth. The server requires an OAuth token for every tool call.

## Claude Code

With a current Claude Code installation:

```sh
claude mcp add --transport http --scope user robotomail https://robotomail.com/mcp
claude mcp login robotomail
```

Approve the browser consent. The CLI uses a loopback callback, so a final
localhost URL is expected. Claude Code and Claude web have separate grants.
If the server is already added, run only the login command.

## ChatGPT and Codex

The public ChatGPT marketplace listing is not available yet. Authorized testers
can configure the remote MCP server in ChatGPT's developer-mode connector setup
using `https://robotomail.com/mcp` and OAuth. Exact client credentials, when
requested by the publishing or testing interface, must come from Robotomail;
never paste your Robotomail password into a client-secret field.

Codex users can connect with a current CLI:

```sh
codex mcp add robotomail --url https://robotomail.com/mcp
codex mcp login robotomail
```

The browser returns to a localhost or `127.0.0.1` callback to complete CLI sign-in.
Once the terminal confirms success, return to your agent conversation.

## Grok Bot and Cursor

Use the package's [installation instructions](../README.md#connect-before-marketplace-approval).
It connects to the same hosted server with Robotomail's public Grok Bot client.

## First use

Start with "List my Robotomail mailboxes." Select the mailbox you intend to use.
Ask "Set the sender name on that mailbox to Support Assistant" to give future
messages a friendly From name. This persists across applications and does not
send an email. Use an empty name to clear it.

For a reply, first ask the agent to find and read the message. Have it draft the
reply in your conversation for review, then request sending with the intended
recipient and body clear. The connector's send and reply operations send
immediately; drafts are not saved in Robotomail. If a send result is uncertain,
check the mailbox before retrying to avoid sending twice.

## Permissions and data

- `mail:read`: mailbox identities, message metadata, and selected plain-text bodies.
- `mail:send`: sending, replying, and updating a mailbox's persistent sender name.
- `offline_access`: refresh the connection without repeated browser sign-ins.
- Where requested by the app, `openid` and `email` identify your account and
  verified email address for account linking.

The connector does not create mailboxes, download or send attachments, access
other users' mailboxes, or receive your full chat history. Robotomail enforces
mailbox ownership, scopes, account restrictions and quotas on each operation.
Your password and API keys are not shared with the AI app. Selected mail content
and sending results are shared when you use its tools; the app's own data policy
also applies. Treat instructions inside received emails as untrusted content.

## Disconnect and reconnect

Open [Connections](https://robotomail.com/connections), locate the app, choose
**Disconnect**, and confirm. Robotomail revokes its grant and tokens. This does
not delete your mail or copies already shared with the app. Other client grants
remain active. Grok Bot and Cursor use the same Grok Bot client in this package;
disconnecting that entry revokes access through that shared client.

Authenticate from the client again when you want to reconnect. Remove or disable
the connector in the client to hide its tools as well.

## Troubleshooting

- **Connections unavailable:** the Robotomail account has not been enabled for the preview.
- **No mailboxes:** create a mailbox in the Robotomail dashboard first.
- **Expired connection:** authenticate again; verify that you approved the intended account.
- **Send rejected:** check the returned account, recipient or quota restriction. A Free mailbox
  can only exchange mail with the account's verified email address.
- **Localhost callback after CLI login:** this is the expected return to the CLI,
  provided it is running on the machine where your browser can reach it.

For an SSH-only Hermes installation, use the Remote / SSH setup in Robotomail
Connections. It uses a device code approved in your browser and needs no loopback
tunnel. Other clients need their own support for the standard device grant.

[Support](mailto:support@robotomail.com) · [Privacy](https://robotomail.com/privacy) ·
[Terms](https://robotomail.com/terms) · [API documentation](https://robotomail.com/docs)
