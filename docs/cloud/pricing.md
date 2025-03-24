---
sidebar_position: 20
title: Pricing
description: Subscription types and pay-as-you-go prices
---

# SQD Cloud Pricing

:::tip
Use our [cost calculator](https://www.sqd.dev/cloud#calculator) if you need a quick estimate
:::

## Free squids

Each account gets a playground [organization](/cloud/resources/organizations) where a single free squid can be deployed. Certain limitations apply; check the [playground organization](/cloud/resources/organizations/#playgrounds) section for details.

## Billing

SQD bills [organizations](/cloud/resources/organizations) for the resources used by their squids. To deploy production-ready squids and [configure](/cloud/reference/scale) their resources, the organization must have a [Professional status](/cloud/resources/organizations/#professional-organizations). All such organizations receive the following perks:

 - unmetered GraphQL API requests
 - deploying any number of pay-as-you-go [dedicated](/cloud/reference/scale/#dedicated) squids
 - deploying any number of pay-as-you-go [collocated](/cloud/reference/scale/#dedicated) squids
 - free 2M [RPC addon](/cloud/resources/rpc-proxy) requests monthly + just `$2/1M` afterwards
 - priority support 

Other resources used by squids are priced as described below. Billing typically occurs on the first day of each month.

We do provide enterprise discounts. If your use case requires a lot of resources or an individual SLA, [book a demo](https://calendly.com/d/yzj-48g-bf7/subsquid-demo) to get a personal quote.

## Pay-as-you-go prices

The pricing is based solely on the resources consumed by the squid, as the SQD Network data is provided free of charge. 
The total squid price is the sum of compute and database storage prices.

Data egress is not billed.

### Storage

Database storage is billed at `0.5$/mo` per Gigabyte, both for dedicated and collocated squids.

### Compute for dedicated squids

Dedicated squids have separate [compute profiles](/cloud/reference/scale/#services) for the Postgres database and API/processor services:

#### API/Processor

- `small`: `0.04$/hr` 
- `medium`: `0.08$/hr`
- `large`: `0.15$/hr`
- `xlarge`: `0.30$/hr`
- `2xlarge`: `0.60$/hr`

API and processor are configured and billed separately. Also, if you use API replicas your cost is multiplied by the number of replicas. For example, running a small processor plus two replicas of medium API costs `0.04+2*0.08=0.20$/hr`.

Full profile descriptions are available [here](/cloud/reference/scale/#api) for the API and [here](/cloud/reference/scale/#processor) for the processor.

#### Database

- `small`: `0.08$/hr`
- `medium`: `0.16$/hr`
- `large`: `0.33$/hr`
- `xlarge`: `0.66$/hr`
- `2xlarge`: `1.32$/hr`

Profiles are described [here](/cloud/reference/pg/#scaling). Combine with the [cost of storage](/cloud/pricing/#storage) to get the full price of maintaining the database.

### Hibernated squids

For hibernated squids only the [storage costs](/cloud/pricing/#storage) are charged.

### Multi-processor squids

For multi-processor squids each processor is charged separately according to the compute profile.

### Collocated (development) squids

Collocated squids share compute resources and thus their performance is NOT guaranteed. We do not recommend using
collocated squids in production, but it's a good fit for development and testing.
Compute is billed at a flat rate of `$0.02/hr` (`~$15/mo`) per each collocated squid (API + processor + DB).
It is not possible to additionally configure a collocated squid except for the storage.

### RPC requests

The premium plan already includes a package of 2M requests per month. Above that, it is `$2/1M` requests. 

## SLAs

Our SLA only applies to [dedicated](/cloud/reference/scale/#dedicated) squids deployed to [Professional organizations](/cloud/resources/organizations/#professional-organizations).

We align with the [SLAs of the Google Cloud Platform](https://cloud.google.com/compute/sla) and will reduce the bill based on the following schedule:

| Uptime | Rebate |
|-----------------|-----------------|
| 95.00% - < 99.50%     | 10%        |
| 90.00% - < 95.00%       | 25%         |
| < 90.00%          | 100%       |

Note that the SLA applies only to the provisioning of the SQD Cloud services (API availability, provisioning of compute resources) and DOES NOT apply to client code. In particular, if a squid is stuck due to a bug or an upstream SQD Network/RPC issue, the SLA discounts don't apply. Similarly, the client is responsible for provisioning compute profiles adequate to the expected traffic.

For Enterprise plan customers, individual SLA terms may be negotiated. 

## Examples

### Small dedicated squid

- 1x API service (small)
- 1x processor (small)
- 1x DB (small)
- 50GB storage

Runs 24/7 (720 hours a month). 

| Service | `$/hr` | `$/mo`          |
|-----------------|-----------------|-----------------|
| API (small) |  `$0.04`    |   |
| Processor (small)  |  `$0.04`    |  |
| Database (small)   | `$0.08`     |     |
| Compute total  |  `$0.16`    | `$115.2` |
| Storage      |          | `$25` |
| **Total**       |      | **`$140.2`** |


### Processor-only squid

A squid writing parquet files to an external s3 bucket. No database or API is provisioned.

- 1x processor (small)

| Service | `$/hr` | `$/mo`          |
|-----------------|-----------------|-----------------|
| Processor (small)  |  `$0.04`    |    |
| Compute total  |  `$0.04`    | `$28.8` |
| **Total**       |      | **`$28.8`** |


### Large production squid

- 2x API service (medium)
- 1x processor (small)
- 1x DB (large)
- 500GB storage

| Service | `$/hr` | `$/mo`          |
|-----------------|-----------------|-----------------|
| 2xAPI (medium)  |  `$0.16`    |   |
| Processor (small) |  `$0.4`    |  |
| Database (large)   | `$0.33`     |     |
| Compute total   |  `$0.53`    | `$381.6` |
| Storage      |          | `$250` |
| **Total**       |      | **`$631.6`** |


### Test collocated squid:

- API + processor + DB (collocated)
- 50GB storage

| Service | `$/hr` | `$/mo`          |
|-----------------|-----------------|-----------------|
| Compute total  | `0.02`    | `$15` |
| Storage      |          | `$25` |
| **Total**       |      | **`$40`** |

## Transition to the Paid Plans

The transition to the paid plans will take place in September 2023 to enable smooth onboarding. 
The existing Cloud users will be able to see the usage and the provisional billing for September, with a full rebate of the total invoice. 
The grace period ends on October 1st, 2023 with the payment rails enabled in the SQD Cloud app.

## FAQ

**Q**: What is the difference between collocated and dedicated squids? Why are collocated squids much cheaper?

**A**: Collocated squids share compute resources which means that it may be unresponsive if the neighbour squid is under high load. 
While we do our best to ensure that the resources are shared fairly, we strongly recommend dedicated services for production use.

**Q**: I deployed my squid yesterday, will it be billed for the whole month?

**A**: No, only the actual hours the squid has been running will be billed.

**Q**: How do I configure the profiles for my squid? 

**A**: Use the [manifest-based deployments](/cloud/reference/manifest/) and [the profile reference](/cloud/reference/scale/).

**Q**: How can I use the provided RPC package? How do I set the rate limits for it?
 
**A**: Please look at the [RPC addon docs](/cloud/resources/rpc-proxy/).

