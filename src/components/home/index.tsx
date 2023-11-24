import React from 'react';
import { GuideCard } from '@site/src/components/guide-card';
import { TutorialCard } from '@site/src/components/tutorial-card';
import {CodeSlider} from "@site/src/components/CodeSlider/CodeSlider";
import CodeSlidesData from "../../_mock/code-slider-data";

export default function Home(): JSX.Element {

  return (
    <div className="onboarding-homepage">
      <div className="flex flex-col gap-6 max-w-[640px] items-start self-start mb-14 pt-2">
        <span className="h3 flex items-center gap-4">Get started <div className="icon icon-mage"></div></span>
        <div className="flex flex-col gap-2 font-light text-fg-base--muted onboarding-homepage__text">
<<<<<<< Updated upstream
          <span>Subsquid is a blockchain indexing SDK and a distributed data lake optimized for serving large volumes of historical on-chain data from over 100+ chains.</span><p></p>
          <span>The SDK offers a highly customizable Extract-Transform-Load-Query stack for indexing events, transactions, traces and state diffs.</span><p></p>
          <span>Indexers built with the SDK (squids) are suitable for both real-time streaming and batch data processing and don't require a high-throughput RPC endpoint to run. As the data is ingested primarily from the data lake, a typical indexing speed is up to and beyond <strong>50,000 blocks per second</strong>.</span>
          {/* <span>To put this into perspective, all 10k events in 4M blocks of <a href="https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984">Uniswap V3 Factory contract</a> history can be indexed in about 8 minutes. For a busier <a href="https://etherscan.io/address/0xc36442b4a4522e871399cd717abdd847ab11fe88">Uniswap V3 Positions NFT contract</a> with 3.1M events and function calls the indexing takes about 40 minutes.</span> */}
=======
          <span>Subsquid Network is a decentralized data lake and a query engine optimized for batch filtering and extraction of large volumes of historical data.</span><p/>
          <span>This documentation covers the Subsquid Network itself and the products built on top:
            <ul>
              <li>Squid SDK -- a lightweight, batch-based toolkit for high-performance indexing without access to an archival RPC.</li>
              <li>Subsquid Cloud -- a hosted servers for one-line deployments of custom indexers and GraphQL APIs.</li>
              <li>Subsquid-Firehose -- a lightweight adapter for running Subgraphs without an archival RPC node.</li>
            </ul>
          </span>
>>>>>>> Stashed changes
        </div>
        <div className="flex flex-wrap gap-2">
        <a
          className="x-button min-w-[140px] border-bg-base--contrast text-fg-base--default"
              href="/sdk/overview">Overview</a>
        <a
          className="x-button min-w-[140px] bg-bg-base--contrast text-fg-base--contrast"
          href="/sdk/squid-development">Dev guide</a>
        </div>
      </div>

        <div className="flex flex-col gap-6 max-w-[640px] items-start self-start mb-14 pt-2">
            <span className="h3 flex items-center gap-4">Examples of data requests</span>
            <CodeSlider slides={CodeSlidesData}/>
        </div>

      {/*
      <section className="flex flex-col gap-12 mb-16">
        <span className="h3 text-fg-base--muted">Subsquid Docs</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
          <ContentFeature
            path="/basics/overview"
            image="/img/scroll-emoji.png"
            title="Overview">
            A bird's eye view of the Subsquid ecosystem
          </ContentFeature>

          <ContentFeature
            path="/basics/squid-development"
            image="/img/squid-emoji.png"
            title="Build a Squid">
            Extract, transform, and serve on-chain data with GraphQL
          </ContentFeature>

          <ContentFeature
            path="/deploy-squid"
            image="/img/desktop-computer-emoji.png"
            title="Deploy a Squid">
            Deploy your squid to the Subsquid Cloud (free of charge)
          </ContentFeature>

          <ContentFeature
            path="/query-squid"
            image="/img/magic-wand-emoji.png"
            title="Query a Squid">
            A reference of GraphQL queries and filters exposed by squids
          </ContentFeature>

          <ContentFeature
            path="https://t.me/HydraDevs"
            image="/img/mage-emoji.png"
            title="Dev Support">
            Get your questions answered and connect with other SquidDevs
          </ContentFeature>

        </div>
      </section>
      */}

      <div className="flex flex-col gap-6 mb-14">
        <span className="h3">Highlights</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2 guide-cards">
          <GuideCard
            path="/sdk/resources/squid-gen"
            color={'bg-role--success'}
            description="Index any smart contract log and transaction data in 5 minutes">Quickstart
          </GuideCard>
          <GuideCard
            path="/sdk/resources/external-api"
            color={'bg-role--success'}
            description="Enrich the indexed data with third-party API and IPFS queries">Query APIs and IPFS
          </GuideCard>
          <GuideCard
            path="/sdk/reference/graphql-server/subscriptions"
            color={'bg-role--success'}
            description="Live query updates with GraphQL subscriptions">GraphQL subscriptions</GuideCard>
          <GuideCard
            path="/cloud/resources/production-alias"
            color={'bg-role--notice'}
            description="Switch between versions with zero downtime">Production aliases</GuideCard>
          <GuideCard
            color={'bg-role--notice'}
            path="/sdk/overview"
            description="The most advanced SDK for indexing Substrate-based chains">Index
            Substrate data</GuideCard>
          <GuideCard
            path="/sdk/resources/substrate/ink"
            color={'bg-role--notice'}
            description="Index WASM contracts developed with ink!">ink! smart contracts</GuideCard>
          <GuideCard
            path="/sdk/resources/subsquid-vs-thegraph"
            color={'bg-role--success'}
            description="Compare the feature set and the architecture">Subsquid vs The Graph
          </GuideCard>
          <GuideCard
            isExternalLink={true}
            path="https://www.youtube.com/playlist?list=PLH2948XqklrgTvG6-ro3eqS17j7n_raiN"
            color={'bg-role--success'}
            description="Step-by-step video tutorials covering the most powerful Subsquid features">Subsquid Academy
          </GuideCard>
          <GuideCard
            isExternalLink={true}
            path="https://github.com/subsquid-labs/"
            color={'bg-role--success'}
            description="Dive into our SDK samples and indexing templates on GitHub">Show me the code!
          </GuideCard>
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-16">
        <span className="h3">Migration</span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
         <TutorialCard
            path="/sdk/resources/migrate/migrate-subgraph"
            description="Migrate your subgraph and improve sync times up to 10x.">Migrate from The Graph</TutorialCard>
         <TutorialCard
            path="/sdk/resources/migrate/migrate-to-arrowsquid"
            description="Migrate your EVM squid to ArrowSquid.">Migrate to ArrowSquid on EVM</TutorialCard>
         <TutorialCard
            path="/sdk/resources/migrate/migrate-to-arrowsquid-on-substrate"
            description="Migrate your Substrate squid to ArrowSquid.">Migrate to ArrowSquid on Substrate</TutorialCard>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <span className="h3">FAQ</span>

        <div className="flex flex-col gap--6">

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">What is a squid?</h4>
                <p className="text-fg-base--muted font-light">
                    A squid is a project that extracts and transforms on-chain data in order to present it as a GraphQL API.
                    Squids are developed using the Subsquid SDK, which provides extensive tooling to define data schemas, data transformation rules, and the
                    shape of the resulting API.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">Why should I use Subsquid?</h4>
                <p className="text-fg-base--muted font-light">
                    The latency of serving app data with a squid is much lower compared to direct node access via gRPC. This means significantly better UX for your application. The flexibility of
                    the Subsquid SDK gives developers the full power to access and manipulate historical on-chain data and build complex and responsive dApps with familiar tools.
                    Finally, by using the Subsquid Cloud, developers no longer have to care about indexing infrastructure maintenance costs and hassle.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">How much does Subsquid cost?</h4>
                <p className="text-fg-base--muted font-light">
                    The Squid SDK is open source. Data access to the Subsquid Network (and Archives) is free as it is incentivized by the networks, thus 
                    for self-hosted or locally ran squids Subsquid services are free of charge. 
                    For managed squids we offer free and Premium plans. See <a href="/cloud/reference/pricing">Cloud pricing</a>. 
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">What is an Archive?</h4>
                <p className="text-fg-base--muted font-light">
                    Archives ingest and store the full log of historical on-chain data in a normalized format.
                    Designed to be data sources for squids, Archives serve on-chain data as an API that supports batching over multiple blocks.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">What is Subsquid Cloud?</h4>
                <p className="text-fg-base--muted font-light">
                    <a
                        href="https://app.subsquid.io/"
                        target="_blank"
                        className="link">Subsquid Cloud</a> is a service for hosting squids. This service is managed by Subsquid Labs.
                    &nbsp;
                    <a href="/squid-cli" className="link">Subsquid's CLI</a> provides a convenient way to
                    &nbsp;
                    <a href="/cloud/overview" className="link">deploy squids</a> to Cloud and manage them once they are hosted.
                </p>
            </div>

        </div>

        <span className="body--s text-fg-base--muted">
          More questions? Check out our <a className="link" href="https://discord.gg/subsquid">technical community</a>
        </span>
      </div>
    </div>
  );
}
