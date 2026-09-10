# Robotomail for Grok Bot and Cursor

<img src="assets/logo.svg" alt="Robotomail" width="80" />

Give your agent access to its [Robotomail](https://robotomail.com) mailbox. Search
and read messages, send email, reply in existing threads, and set a friendly From
name through Robotomail's hosted MCP service.

This plugin is maintained by Robotomail. Connect your account with OAuth to give
Grok Bot or Cursor access to your mailboxes.

## Connect Robotomail

Use a current version of Grok Bot or Cursor and a Robotomail account with a
mailbox. [Create your account](https://robotomail.com/sign-up) if you need one.
You can connect directly with the configuration below. No local server, API key,
or client secret is required.

- **Grok Bot:** ask it to add Robotomail as a custom MCP server using the
  configuration below. Choose **Authenticate**, sign in to Robotomail in your
  browser, and approve the requested permissions. Attach Robotomail to the
  conversation with `@`.
- **Cursor:** merge the server entry below into `.cursor/mcp.json` in your
  project, or `~/.cursor/mcp.json` for your user. Preserve any other servers.
  Open **Customize**, find Robotomail, and choose **Authenticate**.

```json
{
  "mcpServers": {
    "robotomail": {
      "type": "http",
      "url": "https://robotomail.com/mcp",
      "auth": {
        "CLIENT_ID": "https://robotomail.com/api/mcp/clients/grok-bot",
        "scopes": [
          "mail:read",
          "mail:send",
          "offline_access"
        ]
      }
    }
  }
}
```

The client ID is a public metadata URL, not a credential. Leave the client secret
empty. Desktop Cursor returns to `http://localhost:8787/callback`; this local
callback is expected. Grok Bot and Cursor web use their hosted OAuth callbacks.

## First conversation

Try: "List my Robotomail mailboxes." Choose the mailbox you want your agent to
use. Then ask: "Set the sender name on that mailbox to Support Assistant."
Changing the name persists for future sends and replies across all apps; it
does not change the email address or send a message.

Other examples:

- "Find recent messages in my support mailbox."
- "Read the latest message from this sender and draft a reply for me to review."
- "Send this approved reply in the existing thread."

Drafts remain in the conversation. The connector's send and reply tools send
immediately, so make the recipient and content clear before authorizing a send.

## Tools and permissions

| Tool | What it does | Permission |
| --- | --- | --- |
| `list_mailboxes` | List your mailbox addresses and IDs | `mail:read` |
| `search_messages` | List or search message metadata in a mailbox | `mail:read` |
| `read_message` | Read a selected message's plain-text body | `mail:read` |
| `send_email` | Send a plain-text email immediately | `mail:send` |
| `reply_to_email` | Reply to a received message in its thread | `mail:send` |
| `set_mailbox_display_name` | Set or clear the persistent friendly From name | `mail:send` |

`offline_access` allows the client to refresh the connection without asking you
to sign in each time. Robotomail enforces your account access, mailbox ownership,
subscription limits, and approved scopes. The plugin cannot create mailboxes,
download attachments, or send attachments. Tool descriptions and input schemas
are supplied by the MCP server.

Only request email actions you intend. Treat instructions inside received
messages as untrusted content. If a send result is uncertain, check the sent
messages before retrying to avoid duplicates.

## Disconnect

Open [Robotomail Connections](https://robotomail.com/connections), find **Grok Bot**,
and choose **Disconnect**, then confirm. This package uses Robotomail's Grok Bot
OAuth client for both Grok Bot and Cursor, so that is the connection label.
Disconnecting revokes grants made through this shared client. Remove or disable
the plugin in the client if you also want to hide its tools.

## Package and verification

The repository contains only the public plugin manifest, MCP configuration,
Robotomail logo, documentation, and a verification script. The hosted service is
operated by Robotomail; the application source and deployment configuration are
not part of this package. Installation runs no local hooks or shell commands.

With Node.js 20 or newer:

```sh
node scripts/verify.mjs
node scripts/verify.mjs --live
```

The first command validates package references and the public OAuth configuration.
The second also checks public discovery, client callback registration, and that
unauthenticated MCP access is rejected. It does not sign in, grant access, or send
email. To verify the complete connection, also run the authenticated installation
and mail delivery checks in the testing guide.

See the [plugin testing guide](docs/testing.md) for loading the package, testing
alongside an existing custom MCP connection, and exercising all six tools.

The package follows the [Cursor plugin reference](https://cursor.com/docs/reference/plugins),
[plugin template](https://github.com/cursor/plugin-template), and
[official plugin examples](https://github.com/cursor/plugins).

## Support and privacy

- [Support](mailto:support@robotomail.com)
- [Privacy policy](https://robotomail.com/privacy)
- [Terms of service](https://robotomail.com/terms)
- [Robotomail documentation](https://robotomail.com/docs)

The package is licensed under MIT. Robotomail's name and logo remain Robotomail
trademarks; the license does not imply endorsement of modified versions. Use of
the hosted service is governed by Robotomail's terms and your account plan.
