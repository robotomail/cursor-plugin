# Test the Robotomail plugin

You need a current client, an enabled Robotomail account, an existing mailbox,
and an inbox you own for delivery tests. This package is an invite-only preview
and has not been submitted to the public marketplace.

## If Robotomail is already connected

Your custom MCP connection uses the same server and public OAuth client as this
package. It can verify authentication and mail tools, but does not verify that
the client loads this repository's manifest and MCP configuration.

Keep the working connection until the packaged plugin is available in your
client. Then disable the custom entry for the test, so only the package supplies
Robotomail tools. Save its configuration if you need to remove and restore it.

## Load the package in Cursor desktop

Clone into Cursor's local plugin directory, provided this destination does not
already exist:

```sh
mkdir -p ~/.cursor/plugins/local
git clone https://github.com/robotomail/cursor-plugin.git ~/.cursor/plugins/local/robotomail
```

Restart Cursor or run **Developer: Reload Window**. Open **Customize**, confirm
the Robotomail plugin and MCP server appear, and authenticate. An installed
marketplace plugin with the same name takes precedence over the local copy.
Teams/Enterprise admins may need to permit **Allow Local Plugin Imports** under
Dashboard > Settings > Security & Identity > Marketplace and Plugins.
See [Cursor's local plugin instructions](https://cursor.com/docs/plugins#test-plugins-locally).

## Test in Grok Bot

For a Cursor Teams/Enterprise workspace, try Dashboard > Plugins > Team
Marketplaces > Add Marketplace, then **Import from Repo** with this repository
URL. Review Robotomail through **Add to Marketplace** and choose appropriate
test access. See [Cursor's team marketplace instructions](https://cursor.com/docs/plugins#add-a-team-marketplace).

Grok Bot inherits Cursor's team connector policy. This makes the team
marketplace the route to investigate for an unpublished package; importing this
specific repository into Grok Bot has not yet been verified. See
[Grok Bot team connector policy](https://docs.x.ai/grok-bot/teams-and-enterprises).

If the plugin is available, open **Settings > Plugins**, add Robotomail,
authenticate, and attach it to a fresh conversation with `@`. Connections apply
across your Bots, so a fresh conversation does not isolate credentials. See
[Grok Bot app connections](https://docs.x.ai/grok-bot/computer-and-apps#connect-an-app).

The current documentation does not describe a direct GitHub plugin import for
an individual Grok Bot account. If the package is unavailable, keep your custom
MCP connection to test the service and use Cursor desktop to test package
loading. Copying files to your laptop's local plugin folder does not install
them into Grok Bot's cloud environment.

## Exercise authentication and all six tools

1. For a fresh authorization test, disconnect **Grok Bot** in
   [Robotomail Connections](https://robotomail.com/connections), then authenticate
   from the packaged plugin and approve the requested permissions. Both the
   custom connection and package share this client, so disconnecting revokes
   both. Record whether consent returns successfully to the client.
2. Ask **"List my Robotomail mailboxes."** Confirm `list_mailboxes` returns your
   mailbox and select it explicitly.
3. Ask to set its sender name to **Robotomail Plugin Test**. Confirm
   `set_mailbox_display_name` succeeds. Remember the previous name to restore
   after testing; the change persists across applications.
4. Ask the agent to send an email to your own inbox with a unique subject such
   as **Robotomail plugin test 2026-09-10**. Approve that exact recipient and
   content. Confirm `send_email` succeeds and check delivery and the From name
   in your inbox. On the Free plan, use your account's verified email address.
5. Reply from that inbox to the Robotomail mailbox. Ask the agent to find the
   reply and read it. Confirm both `search_messages` and `read_message` run and
   return the expected message.
6. Ask the agent to reply in that thread with an agreed test response. Confirm
   `reply_to_email` succeeds and the response reaches your inbox in the thread.
7. Disconnect in Robotomail Connections. Attempt a fresh mailbox lookup before
   approving any new authentication. Access through the old grant must fail or
   prompt for reconnection. Reconnect and verify a new lookup succeeds.
8. Restore your previous sender name and remove any duplicate custom entry you
   no longer need.

Record the client/version, plugin commit, installation method, tool results,
delivery result and reconnect result. Keep mailbox contents and credentials out
of public issues. A pass using custom MCP should be recorded separately from a
pass using the actual plugin package. Automated package verification is
documented in the [README](../README.md#package-and-verification).
