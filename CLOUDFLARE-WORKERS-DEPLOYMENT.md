# IronPin Aerial: Cloudflare Workers Git Deployment

## Use this guide with the current Cloudflare screen

The form that asks for **Project Name**, **Build Command**, and **Deploy Command** is Cloudflare **Workers Builds**. It is the correct path for this revised repository. The repository contains a `wrangler.jsonc` file and a `worker.js` entry point so Cloudflare Workers can serve the static website and run the contact-form endpoint in one deployment.

> Do not create a separate Pages project for this repository. Do not create another standalone Worker. Continue in the current Git-connected Worker setup screen.

## Exact fields to enter

Use these values on the current **Set up your application** form.

| Dashboard field | Enter this value | Why |
|---|---|---|
| Project Name | `ironpin-aerial` | Must match `name` in `wrangler.jsonc`. |
| Build Command | `pnpm build` | Builds the Vite frontend and prerenders all public routes. |
| Deploy Command | `npx wrangler deploy` | Deploys the Worker plus the static output referenced by `wrangler.jsonc`. |
| Non-production branch deploy command | Leave the default | Cloudflare’s default preview command is appropriate. |
| Path | Leave blank | The repository root is the app root. |
| API Token | Leave at Cloudflare’s default / auto-created choice | Workers Builds creates an API token automatically unless you deliberately select an existing token. |
| API Token Name | Leave blank | Only required when selecting or creating a custom token. |
| Variable Name | Leave blank for now | Build variables are not the right location for runtime email secrets. |
| Variable Value | Leave blank for now | Configure runtime secrets after the first deployment. |

Then select **Deploy**. Cloudflare documents that Workers Builds runs the build command and then deploys with the configured Wrangler command. It also notes that the dashboard Worker name must match the `name` configured in Wrangler. [1]

## What the Worker configuration does

The supplied `wrangler.jsonc` deploys `dist/public` as static assets, keeps the existing prerendered routes (`/`, `/services`, `/who-we-serve`, `/about`, and `/contact`), and invokes the Worker only for `/api/*`. The `worker.js` file receives `/api/contact` requests and sends quote inquiries through Resend. All non-API requests are served as static site files.

Cloudflare documents `assets.directory` for static files and supports targeted `run_worker_first` patterns such as `/api/*`, which is exactly the routing pattern used here. [2] The default `auto-trailing-slash` HTML handling supports this project’s directory-based prerendered output, including `/about/index.html` and `/services/index.html`. [3]

## After the first deployment: configure runtime secrets

Once the initial build succeeds, open the Worker in Cloudflare and choose **Settings → Variables and Secrets**. Add the following **encrypted runtime secrets**. Do not add them in the Git build form and never commit their values to GitHub.

| Secret name | Required value |
|---|---|
| `RESEND_API_KEY` | Your existing Resend API key |
| `RESEND_FROM` | `IronPin Aerial <info@ironpinaerial.com>` or the verified Resend sender currently in use |
| `QUOTE_TO` | `info@ironpinaerial.com` or the inbox that should receive quote requests |

The Worker keeps the prior form safeguards: it silently ignores filled honeypot fields and submissions made in under three seconds, validates required fields, sets the visitor’s address as the email Reply-To value, and sends quote email through the Resend API. Cloudflare distinguishes build variables from runtime variables; these values must be runtime secrets. [1]

Deploy again after adding the secrets, then submit a real test request on the generated `workers.dev` URL. Confirm the email arrives, the Reply-To address is correct, and the browser redirects to `/thank-you`.

## Domain cutover after testing

Keep Manus online until the `workers.dev` test succeeds. After that, open the Worker’s **Settings → Domains & Routes**, add `ironpinaerial.com`, and then add `www.ironpinaerial.com`. Cloudflare will guide you through the corresponding routing or DNS configuration because your zone is already on Cloudflare.

At final cutover, change only the site-hosting records that currently target `ironpinair-uvlwsahz.manus.space`. Keep iCloud+ MX/DKIM, Resend DNS, SPF, DMARC, Google verification, and agent-discovery records unchanged. Keep or recreate the existing redirect rule from `www.ironpinaerial.com/*` to `https://ironpinaerial.com/$1`.

## Quick verification checklist

| URL or action | Expected result |
|---|---|
| `/` | Homepage and hero imagery load. |
| `/services`, `/who-we-serve`, `/about`, `/contact` | Each prerendered route loads with no missing images. |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | Site discovery files load. |
| `/.well-known/api-catalog` | Public agent-discovery file loads. |
| Contact form | Delivers a message through Resend and redirects to Thank You. |
| `www.ironpinaerial.com/about` | Redirects to the apex domain equivalent. |

## Safe rollback

If a critical issue appears after the domain cutover, restore the existing `@` and `www` website records to the Manus target `ironpinair-uvlwsahz.manus.space`. Do not alter mail or verification records. Keep this source repository and its tagged deployment history as the new portable backup.

## References

[1]: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ "Cloudflare Workers Builds — Configuration"
[2]: https://developers.cloudflare.com/workers/static-assets/binding/ "Cloudflare Workers Static Assets — Configuration and Bindings"
[3]: https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/ "Cloudflare Workers Static Assets — Static Site Generation"
