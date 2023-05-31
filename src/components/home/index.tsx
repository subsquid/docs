import React from 'react';
import { GuideCard } from '@site/src/components/guide-card';
import { TutorialCard } from '@site/src/components/tutorial-card';

export default function Home(): JSX.Element {

  return (
    <div className="onboarding-homepage">
      <div className="flex flex-col gap-6 max-w-[640px] items-start self-start mb-14 pt-2">
        <span className="h3 flex items-center gap-4">Get started <div className="icon icon-mage"></div></span>
        <div className="flex flex-col gap-2 font-light text-fg-base--muted onboarding-homepage__text">
          <span>Subsquid is a full-stack blockchain indexing SDK and specialized data lakes (Archives) optimized for extraction of large volumes of historical on-chain data.</span><p/>
          <span>The SDK offers a highly customizable Extract-Transform-Load-Query stack and indexing speeds of up to and beyond <strong>50,000 blocks per second</strong> when indexing events and transactions.</span><p/>
          <span>To put this into perspective, all 10k events in 4M blocks of <a href="https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984">Uniswap V3 Factory contract</a> history can be indexed in about 8 minutes. For a busier <a href="https://etherscan.io/address/0xc36442b4a4522e871399cd717abdd847ab11fe88">Uniswap V3 Positions NFT contract</a> with 3.1M events and function calls the indexing takes about 40 minutes.</span>
        </div>
        <div className="grid grid-rows-1 grid-cols-2 gap-2">
        <a
          className="x-button bg-bg-base--contrast text-fg-base--contrast"
          href="/quickstart">Quickstart</a>
        <a
          className="x-button bg-bg-base--contrast text-fg-base--contrast"
              href="/basics/overview">Overview</a>
        </div>
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
      */}

      <div className="flex flex-col gap-6 mb-14">
        <span className="h3">Highlights</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2 guide-cards">
          <GuideCard
            path="/quickstart/quickstart-ethereum/"
            color={'bg-role--success'}
            description="Blazing fast batch indexing of logs and txs for major EVM chains">Index EVM data
          </GuideCard>
          <GuideCard
            path="/basics/external-api"
            color={'bg-role--success'}
            description="Enrich the indexed data with third-party API and IPFS queries">Query APIs and IPFS
          </GuideCard>
          <GuideCard
            path="/graphql-api/subscriptions"
            color={'bg-role--success'}
            description="Live query updates with GraphQL subscriptions">GraphQL subscriptions</GuideCard>
          <GuideCard
            path="/deploy-squid/promote-to-production"
            color={'bg-role--notice'}
            description="Switch between versions with zero downtime">Production aliases</GuideCard>
          <GuideCard
            color={'bg-role--notice'}
            path="/quickstart/quickstart-substrate/"
            description="The most advanced SDK for indexing Substrate-based chains">Index
            Substrate data</GuideCard>
          <GuideCard
            path="/tutorials/create-a-wasm-processing-squid"
            color={'bg-role--notice'}
            description="Index WASM contracts developed with Ink!">WASM smart contracts</GuideCard>
          <GuideCard
            path="/migrate/subsquid-vs-thegraph/"
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
            path="/migrate/migrate-subgraph"
            description="Migrate your subgraph and improve sync times up to 10x.">Migrate from The Graph</TutorialCard>
        {/* <TutorialCard
            path="/migrate/migrate-to-fire-squid"
            description="Migrate to FireSquid from older versions of squid SDK">Migrate to FireSquid</TutorialCard>
         <TutorialCard
            path=""
            description="Coming soon" 
  disabled={true}>Migrate From Subquery</TutorialCard> */} 
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <span className="h3">FAQ</span>

        <div className="flex flex-col gap--6">

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">What is a squid?</h4>
                <p className="text-fg-base--muted font-light">
                    A squid is a project that extracts and transforms on-chain data in order to present it as a GraphQL API.
                    Squids are developed using the Subsquid SDK, which provides extensive tooling to define data schemas, data transfomation rules, and the
                    shape of the resulting API.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">Why should I use Subsquid?</h4>
                <p className="text-fg-base--muted font-light">
                    The latency of serving app data with a squid is much lower compared to direct node access via gRPC. This means significantly better UX for your application. The flexibility of
                    the Subsquid SDK gives developers the full power to access and manipulate historical on-chain data and build complex and responsive dApps with familiar tools.
                    Finally, by using the Aquarium cloud service, developers no longer have to care about indexing infrastructure maintenance costs and hassle.
                </p>
            </div>

            <div className="relative border border-border-color-base--default rounded-lg p-6 mb-8">
                <h4 className="mb-4 body--m">How much does Subsquid cost?</h4>
                <p className="text-fg-base--muted font-light">
                    The Subsquid SDK is open source, and access to public Archives maintained by Subsquid Labs is free of charge. Following our TGE and mainnet launch, the price of Archive queries will be determined by an open market.
                    The basic plan for deploying squids to the Aquarium is free and always will be, with some premium features to be introduced in the future.
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
                <h4 className="mb-4 body--m">What is Aquarium?</h4>
                <p className="text-fg-base--muted font-light">
                    <a
                        href="https://app.subsquid.io/aquarium/"
                        target="_blank"
                        className="link">Aquarium</a> is a cloud service for hosting squids. This service is managed by Subsquid Labs.
                    &nbsp;
                    <a href="/deploy-squid/squid-cli" className="link">Subsquid's CLI</a> provides a convenient way to deploy squids to the Aquarium and manage them once they are hosted.
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
