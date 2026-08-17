# Agent Authentication — IronPin Aerial

## Summary

IronPin Aerial (https://ironpinaerial.com) is a public-facing marketing and
contact site. There are no protected APIs or authenticated endpoints exposed
to external agents.

## Public Resources

All of the following are publicly accessible without authentication:

- `GET /llms.txt` — plain-text site summary for LLM ingestion
- `GET /.well-known/api-catalog` — RFC 9727 API catalog (application/linkset+json)
- `GET /.well-known/agent-skills/index.json` — Agent Skills discovery index
- `GET /.well-known/mcp/server-card.json` — MCP Server Card

## Contact Form

The contact/quote request form at https://ironpinaerial.com/contact accepts
POST requests via the site UI only. There is no public REST or tRPC endpoint
for programmatic form submission.

## No Agent Registration Required

No registration, credentials, or tokens are needed to access any resource on
this site. Agents may crawl and index all public pages freely, subject to the
preferences declared in `/robots.txt`.
