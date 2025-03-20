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
          <span><b>SQD Network</b> is a decentralized query engine optimized for batch extraction of large volumes of data. It currently
            serves historical on-chain data ingested from 100+ <a href="/subsquid-network/reference/networks/#evm--ethereum-compatible">EVM</a> and <a href="/subsquid-network/reference/networks/#substrate-based">Substrate</a> networks, as well as <a href="/solana-indexing">Solana</a> (in beta), <a href="/tron-indexing">Tron</a>, <a href="/subsquid-network/reference/starknet-api">Starknet</a> and <a href="/fuel-indexing">Fuel</a>. The data is comprehensive: for example, on EVM it includes event logs, transaction receipts, traces and per-transaction state diffs.</span><p/>
          <span>This documentation covers the <b>SQD Network</b> itself and the complimentary products developed by SQD:
            <ul>
              <li><a href="/sdk/overview">Squid SDK</a> - a Typescript toolkit for high-performance batch indexing sourcing the data from the SQD Network, without accessing an archival RPC.</li>
              <li><a href="/cloud/overview">SQD Cloud</a> - a hosted service for custom indexers and GraphQL APIs.</li>
              <li><a href="/subgraphs-support">SQD Firehose</a> - a lightweight adapter for running subgraphs against SQD Network, without accessing an archival RPC node.</li>
              <li><a href="/apeworx">ApeWorx SQD plugin</a> - use SQD Network as a fast data source for the ApeWorx framework.</li>
            </ul>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
        <a
          className="x-button min-w-[140px] border-bg-base--contrast text-fg-base--default"
              href="/overview">Overview</a>
        </div>
      </div>

        <div className="flex flex-col gap-6 max-w-[640px] items-start self-start mb-14 pt-2">
            <span className="h3 flex items-center gap-4">Squid SDK indexing examples</span>
            <CodeSlider slides={CodeSlidesData}/>
        </div>

      {/*
      <section className="flex flex-col gap-12 mb-16">
        <span className="h3 text-fg-base--muted">SQD Docs</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
          <ContentFeature
            path="/basics/overview"
            image="/img/scroll-emoji.png"
            title="Overview">
            A bird's eye view of the SQD ecosystem
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
            Deploy your squid to the SQD Cloud (free of charge)
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
            path="/sdk/how-to-start/"
            color={'bg-role--success'}
            description="A 5 minutes intro into Squid SDK">Quickstart
          </GuideCard>
          <GuideCard
            path="/sdk/resources/basics/external-api"
            color={'bg-role--success'}
            description="Power up your indexer with third-party APIs and IPFS queries">Query APIs and IPFS
          </GuideCard>
          <GuideCard
            path="/sdk/resources/graphql-server/subscriptions"
            color={'bg-role--success'}
            description="Live query updates with GraphQL subscriptions">GraphQL subscriptions</GuideCard>
          <GuideCard
            path="/cloud/resources/production-alias"
            color={'bg-role--notice'}
            description="Manage indexers deployed to SQD Cloud with zero downtime">Production aliases</GuideCard>
          <GuideCard
            color={'bg-role--notice'}
            path="/sdk/overview"
            description="The most advanced SDK for indexing Substrate-based chains">Index
            Substrate data</GuideCard>
          <GuideCard
            path="/sdk/resources/substrate/ink"
            color={'bg-role--notice'}
            description="First-class indexing of WASM contracts developed with ink!">ink! smart contracts</GuideCard>
          <GuideCard
            path="/sdk/subsquid-vs-thegraph"
            color={'bg-role--success'}
            description="Compare the feature set and the architecture">SQD vs The Graph
          </GuideCard>
          <GuideCard
            isExternalLink={true}
            path="https://www.youtube.com/playlist?list=PLH2948XqklrgTvG6-ro3eqS17j7n_raiN"
            color={'bg-role--success'}
            description="Stay ahead of the curve and discover the latest trends in Web3 data">SQD Blog
          </GuideCard>
          <GuideCard
            isExternalLink={true}
            path="https://github.com/subsquid-labs/"
            color={'bg-role--success'}
            description="Learn by example: ready-to-use indexers built with Squid SDK">Show me the code!
          </GuideCard>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <span className="h3">FAQ</span>

        <div className="flex flex-col gap--6">

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">What is a squid?</h4>
                <p className="text-fg-base--muted font-light">
                    A squid is a indexing project developed using the Squid SDK. It normally extracts the historicaln on-chain data from SQD Network,
                    decodes and transforms it, and persists into a target store (such as Postgres or s3 bucket). The transformed 
                    data may be optionally served with a GraphQL API.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">Why should I use SQD?</h4>
                <p className="text-fg-base--muted font-light">
                    Indexing on-chain data is essential for building Web3 applications and analytic dashboards. SQD Network and the products build on top
                    offer extremely fast and cost-efficient way to extract and index the historical data, even from lesser known chains. It reduces the data 
                    extraction and indexing costs by up to 90% compared to direct indexing using centralized RPC providers like Alchemy or Infura.  
                    Finally, by using the SQD Cloud, developers no longer have to care about indexing infrastructure maintenance costs and hassle.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">How does SQD compare to The Graph?</h4>
                <p className="text-fg-base--muted font-light">
                   SQD is modular -- the on-chain data is extracted from a decentralized data layer (<a href="/subsquid-network/">SQD Network</a>), rather than 
                   directly from a blockchain node. It enables up to 100x faster indexing, guaranteed data consistensy and reliable indexing even for small networks.
                   For a detailed feature comparison, see <a href="/sdk/subsquid-vs-thegraph/">SQD vs The Graph</a>.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">How much does SQD cost?</h4>
                <p className="text-fg-base--muted font-light">
                    The Squid SDK is open source. Accessing the data from the SQD Network is free until the mainnet launch, and 
                    afterwards is projected to be in the range of $1-$5 for a terabyte of extracted data.
                    The SQD Cloud offers a free playground space for developing indexers and a hosted service
                    for production-ready indexing pipelines. The pay-as-you-go pricing only accounts 
                    for the actual compute and storage resources consumed by the indexer, 
                    see <a href="/cloud/pricing">for the pricing details</a>. 
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">What is SQD Cloud?</h4>
                <p className="text-fg-base--muted font-light">
                    <a
                        href="https://app.subsquid.io/"
                        target="_blank"
                        className="link">SQD Cloud</a> is a service for hosting indexers, managed by Subsquid Labs.
                    &nbsp;
                    <a href="/squid-cli" className="link">Squid CLI</a> provides a convenient way to
                    &nbsp;
                    <a href="/cloud/overview" className="link">run, deploy and manage indexing projects (squids)</a> locally and in the Cloud.
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
