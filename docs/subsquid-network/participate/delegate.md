---
sidebar_position: 10
title: Delegate
description: Delegate your tokens to workers
---

# Delegate

:::info
By delegating you're committing your tokens for a period of 50000 Ethereum blocks (a bit less than seven days) + the time until the end of the current [epoch](/subsquid-network/faq/#epoch) (20 minutes or less). Withdrawal will not be possible during that time.
:::

The easiest way to participate in SQD Network is to delegate your `SQD` tokens to one of the workers. Here's how to do it.

1. Go to [network.subsquid.io](https://network.subsquid.io).

2. Go to the "Dashboard" tab if you aren't there already. You should see something like this:

   ![Network app dashboard](./delegate_dashboard.png)

3. Pick a worker and press the "Delegate" button. You should see a form like this:

   ![Delegation form](./delegate_form.png)

   Enter the amount of `SQD`s you'd like to delegate and press the button.

4. Confirm the transaction in your wallet and wait for it to go through.

5. Go to the "Delegate" tab to view your delegations. Note that the "Undelegate" button is inactive - you cannot undelegate until the current [epoch](/subsquid-network/faq/#epoch) ends.

   ![My delegations](./delegate_my_delegations.png)

## Undelegating

1. Wait for your delegation lockup period to expire if you haven't already. The period is 50000 Ethereum block, starting at the first block following the end of the [epoch](/subsquid-network/faq/#epoch) when you delegated the tokens. So, roughly **7 days**.

2. Go to [network.subsquid.io](https://network.subsquid.io).

3. Go to the "Delegate" tab. You should see your delegation there.

4. Click the "Undelegate" button. You should see a form like this one:

   ![Undelegation form](./delegate_undelegate.png)

   :::info
   An inactive "Undelegate" button likely indicates the delegation lockup period still haven't passed.
   :::

5. Enter the `SQD` amount you want to withdraw, click the large new "Undelegate" button and confirm the transaction.

## Maximizing the rewards

- You'll get most rewards if you delegate to high quality but obscure workers. Look for workers with high uptime percentage and a lot of free delegation capacity.
- Currently, both the worker and its delegators are rewarded the most when the total delegated `SQD` count is around `30_000`. Anything more or less means less rewards.
