import React from 'react';
import { ContentFeature } from '@site/src/components/content-feature';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { GuideCard } from '@site/src/components/guide-card';
import { ExpandContent } from '@site/src/components/Expand/ExpandContent';
import { TutorialCard } from '@site/src/components/tutorial-card';

export default function Home(): JSX.Element {

  return (
    <div className="onboarding-homepage">
      <div className="flex flex-col gap-4 max-w-[600px] items-start self-start mb-14 pt-8">
        <span className="h3">Get started</span>
        <div className="flex flex-col gap-6">
          <div className="body--s">
          <span>Subsquid is a full-stack blockchain indexing SDK and a hosted service.</span><p/>
          <span>Its modular design offers unparalleled flexiblity and indexing speeds of up to and beyond <strong>50000 blocks per second</strong> when indexing events and transactions.</span><p/>
          <span>To put it in a perspective, all 10k events in 4M blocks long history of the <a href="https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984">Uniswap V3 Factory contract</a> can be indexed in about 8 min, and all 3.1M events and function calls of <a href="https://etherscan.io/address/0xc36442b4a4522e871399cd717abdd847ab11fe88">Uniswap V3 Positions NFT</a> take about 40 min.</span>
          </div>
          <div className="flex gap-2">
            <a
              className="x-button bg-bg-base--contrast text-fg-base--contrast"
              href="/quickstart">Quickstart</a>
            <a
              className="x-button bg-bg-base--contrast text-fg-base--contrast"
              href="/basics/overview">Overview</a>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-12 mb-18">
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
            Deploy your squid to the Aquarium (free of charge)
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

      <div className="flex flex-col gap-12 mb-14">
        <span className="h3 text-fg-base--muted">Highlights</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
          <GuideCard
            path="/tutorials/create-an-ethereum-processing-squid"
            color={'bg-role--success'}
            description="Index EVM smart contracts on chains like Ethereum, Polygon, BSC">Index EVM data
          </GuideCard>
          <GuideCard
            color={'bg-role--notice'}
            path="/tutorials/create-a-simple-squid"
            description="Learn how to build a simple squid for a Substrate-based chain">Index
            Substrate data</GuideCard>
          <GuideCard
            path="/deploy-squid/promote-to-production"
            color={'bg-role--warning'}
            description="Switch between squid versions with zero downtime">Promote to production</GuideCard>
          <GuideCard
            path="/tutorials/create-a-wasm-processing-squid"
            color={'bg-role--success'}
            description="Index WASM contracts developed with Ink!">WASM smart contracts</GuideCard>
          <GuideCard
            path="/graphql-api/subscriptions"
            color={'bg-role--notice'}
            description="Live query updates with GraphQL subscriptions">GraphQL subscriptions</GuideCard>
          <GuideCard
            path="/tutorials/create-an-evm-processing-squid"
            color={'bg-role--success'}
            description="Index data from Substrate EVM chains like Moonbeam and Astar">Frontier EVM data</GuideCard>
        </div>
      </div>

      <div className="flex flex-col gap-12 mb-14">
        <span className="h3 text-fg-base--muted">Migration</span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
         <TutorialCard
            path="/migrate/migrate-subgraph"
            description="Migrate your subgraph and improve sync times up to 10x.">Migrate from TheGraph</TutorialCard>
         <TutorialCard
            path="/migrate/migrate-to-fire-squid"
            description="Migrate to FireSquid from older versions of squid SDK">Migrate to FireSquid</TutorialCard>
        {/* <TutorialCard
            path=""
            description="Coming soon" 
  disabled={true}>Migrate From Subquery</TutorialCard> */} 
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <span className="h3 text-fg-base--muted">FAQ</span>

        <div className="flex flex-col gap--6">

          <ExpandContent title="What is a squid?">
            <p className="text-fg-base--muted">
              A squid is a project that extracts and transforms on-chain data in order to present it as a GraphQL API. 
              Squids are developed using the Subsquid SDK, which provides extensive tooling to define data schemas, data transfomation rules, and the 
              shape of the resulting API.
            </p>
          </ExpandContent>

          <ExpandContent title="Why should I use Subsquid?">
            <p className="text-fg-base--muted">The latency of serving app data with a squid is much lower compared to direct node access via gRPC. This means significantly better UX for your application. The flexibility of 
            the Subsquid SDK gives developers the full power to access and manipulate historical on-chain data and build complex and responsive dApps with familiar tools. 
            Finally, by using the Aquarium cloud service, developers no longer have to care about indexing infrastructure maintenance costs and hassle.
            </p>
          </ExpandContent>

          <ExpandContent
            title="How much does Subsquid cost?">
            <p className="text-fg-base--muted">The Subsquid SDK is open source, and access to public Archives maintained by Subsquid Labs is free of charge. Following our TGE and mainnet launch, the price of Archive queries will be determined by an open market.
            The basic plan for deploying squids to the Aquarium is free and always will be, with some premium features to be introduced in the future.
            </p>
          </ExpandContent>

          <ExpandContent
            title="What is an Archive?">
            <p className="text-fg-base--muted">Archives ingest and store the full log of historical on-chain data in a normalized format. 
            Designed to be data sources for squids, Archives serve on-chain data as an API that supports batching over multiple blocks. 
          </p>
          </ExpandContent>

          <ExpandContent
            title="What is Aquarium?">
            <p className="text-fg-base--muted"><a
              href="https://app.subsquid.io/aquarium/"
              target="_blank"
              className="text-fg-role--active">Aquarium</a> is a cloud service for hosting squids. This service is managed by Subsquid Labs.
              &nbsp;
              <a href="/deploy-squid/squid-cli" className="text-fg-role--active">Subsquid's CLI</a> provides a convenient way to deploy squids to the Aquarium and manage them once they are hosted.
            </p>
          </ExpandContent>
        </div>

        <span className="body--s text-fg-base--muted">
          More questions? Check out our extensive <a
          href="/faq">FAQ</a>
        </span>
      </div>
    </div>
  );
}
