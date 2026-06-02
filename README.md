# n8n-nodes-fuel-prices-api

An [n8n](https://n8n.io/) community node that returns real-time US gas station fuel prices and station details for any ZIP code, city, or GPS coordinate. It is backed by the [Fuel Prices API](https://apify.com/johnvc/fuelprices?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per result, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Give the node a location and a fuel grade, and it returns one item per nearby station with the name, address, distance, cash and credit prices, price timestamps, and ratings. It also works as an **AI Agent tool**, so an agent can look up local fuel prices on demand.

- Search by ZIP code, city name, or `latitude, longitude` coordinates
- Choose a fuel grade: Regular, Midgrade, Premium, Diesel, E85, or Unleaded 88
- Choose how much data to return per station: Simplified, Raw, or Selected Fields
- Coverage is primarily the United States, with some Canadian locations

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-fuel-prices-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **Fuel Prices** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**Fuel Price > Search** returns fuel prices and station details near a location.

| Parameter | Description |
| --- | --- |
| Search Location | ZIP code, city name, or `latitude, longitude` coordinates. Required. |
| Fuel Type | Regular, Midgrade, Premium, Diesel, E85, or Unleaded 88. Defaults to Regular. |
| Maximum Data Age (Days) | Only return stations whose prices were reported within this many days. Use `0` for no limit. |
| Output | How much station data to return: Simplified, Raw, or Selected Fields. |

## Output

The API returns more than ten fields per station, so the **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact, readable object with the station name, a combined `address`, `distance`, `cashPrice`, `creditPrice`, `priceUnit`, and `starRating`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each station, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

Each station is returned as its own n8n item.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Unique station identifier |
| `name` | string | Station name or brand |
| `distance` | number | Distance from the search location, in miles |
| `priceUnit` | string | Currency and unit, for example `USD/GAL` |
| `starRating` | number | Average user rating, 0 to 5 |
| `ratingsCount` | integer | Number of user ratings |
| `address_line1` | string | Street address |
| `address_line2` | string | Secondary address line, if any |
| `address_locality` | string | City |
| `address_region` | string | State or region, for example `NY` |
| `address_postalCode` | string | ZIP or postal code |
| `price_cash` | number | Cash price per unit |
| `price_cash_postedTime` | string | When the cash price was reported (ISO 8601) |
| `price_credit` | number | Credit price per unit |
| `price_credit_postedTime` | string | When the credit price was reported (ISO 8601) |

## Example workflows

### 1. Find the cheapest regular gas near a ZIP code

1. **Manual Trigger**
2. **Fuel Prices**: set Search Location to `11507`, Fuel Type to `Regular`, Output to `Simplified`.
3. **Sort**: sort the items by `cashPrice` ascending. The first item is the cheapest station.

### 2. Daily diesel price watch

1. **Schedule Trigger**: run once a day.
2. **Fuel Prices**: set Search Location to your city, Fuel Type to `Diesel`.
3. **Filter** (or **IF**): keep stations where `cashPrice` is below your target.
4. **Send Email** or **Slack**: notify yourself with the matching stations.

### 3. Let an AI Agent answer fuel questions

1. **AI Agent** node.
2. Attach **Fuel Prices** as a tool.
3. Ask the agent something like "What is the cheapest diesel near 90210?" The agent calls the node (in Simplified mode) and answers with live prices.

## Pricing

This node calls the [Fuel Prices API](https://apify.com/johnvc/fuelprices?fpr=9n7kx3) on Apify, which is billed **pay-per-result**: about **$0.001 per gas station returned**, with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/fuelprices?fpr=9n7kx3) for current rates.

## Resources

- [Fuel Prices API on Apify](https://apify.com/johnvc/fuelprices?fpr=9n7kx3)
- [npm package](https://www.npmjs.com/package/n8n-nodes-fuel-prices-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
