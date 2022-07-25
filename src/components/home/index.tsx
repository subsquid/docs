import React from 'react';
import { ContentFeature } from '@site/src/components/content-feature';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { GuideCard } from '@site/src/components/guide-card';
import { ExpandContent } from '@site/src/components/Expand/ExpandContent';
import { TutorialCard } from '@site/src/components/tutorial-card';

export default function Home(): JSX.Element {

  if (ExecutionEnvironment.canUseDOM) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  return (
    <div>
      <div className="flex flex-col gap-4 max-w-[476px] items-start self-start mb-24 pt-8">
        <span className="heading--3">Get started
</span>
        <div className="flex flex-col gap-6">
          <p className="body--s">Try Subsquid with a simple squid indexing all historical transfers on Kusama in under 15 minutes</p>
          <a
            className="x-button bg-bg-base--contrast text-fg-base--contrast"
            href="/quickstart">Quickstart</a>
        </div>
      </div>

      <section className="flex flex-col gap-12 mb-28">
        <span className="heading--3 text-fg-base--muted">Subsquid Docs</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
          <ContentFeature
            path="/overview"
            image="/img/scroll-emoji.png"
            title="Overview">
            A bird eye view of the Subsquid architecture 
          </ContentFeature>

          <ContentFeature
            path="/develop-a-squid"
            image="/img/squid-emoji.png"
            title="Build a Squid">
            Extract, transform and serve on-chain data with GraphQL
          </ContentFeature>

          <ContentFeature
            path="/run-squid"
            image="/img/gear-emoji.png"
            title="Run a Squid">
            Test your squid locally or run with Docker
          </ContentFeature>

          <ContentFeature
            path="/deploy-squid"
            image="/img/desktop-computer-emoji.png"
            title="Deploy a Squid">
            Deploy your squid to Aquarium free of charge
          </ContentFeature>

          <ContentFeature
            path="/query-squid"
            image="/img/magic-wand-emoji.png"
            title="Query a Squid">
            A reference of GraphQL queries and filters exposed by a squid
          </ContentFeature>

          <ContentFeature
            path="https://t.me/HydraDevs"
            image="/img/mage-emoji.png"
            title="Dev Support">
            Get your questions answered and connect with other SquidDevs
          </ContentFeature>

        </div>
      </section>

      <div className="flex flex-col gap-12 mb-24">
        <span className="heading--3 text-fg-base--muted">Tutorials</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
        <GuideCard
            path="/tutorials/development-environment-set-up"
            color={'bg-role--warning'}
            description="Follow these steps in order to begin building with Subsquid.">Dev environment setup</GuideCard>
          <GuideCard
            color={'bg-role--notice'}
            path="/tutorials/create-a-simple-squid"
            description="Learn how to build a simple Squid API to provide data to you application.">Create your first
            Squid</GuideCard>
          <GuideCard
            path="/tutorials/create-an-evm-processing-squid"
            color={'bg-role--success'}
            description="Index data from EVM chains like Moonbeam and Astar">EVM smart contract
            data</GuideCard>
          <GuideCard
            isDisabled={true}
            color={'bg-role--syncing'}
            description="Coming soon">WASM smart contracts</GuideCard>
          <GuideCard
            isDisabled={true}
            color={'bg-role--syncing'}
            description="Coming soon">EVM+ smart contracts</GuideCard>
          <GuideCard
            isDisabled={true}
            color={'bg-role--syncing'}
            description="Coming soon">GraphQL subscriptions</GuideCard>
        </div>
      </div>

      <div className="flex flex-col gap-12 mb-24">
        <span className="heading--3 text-fg-base--muted">Migration</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
          <TutorialCard
            path="/migrate/migrate-to-fire-squid"
            description="Migrate to FireSquid and improve sync times up to 10x">Migrate to FireSquid</TutorialCard>
        {/* <TutorialCard
            path=""
            description="Coming soon" 
  disabled={true}>Migrate From Subquery</TutorialCard> */} 
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <span className="heading--3 text-fg-base--muted">FAQ</span>

        <div className="flex flex-col gap--6">

          <ExpandContent title="What is a squid?">
            <p className="text-fg-base--muted">
              Squid is a project to extract and transform on-chain data and then present it with a GraphQL API or otherwise. 
              Squids are developed with the Squid SDK that provides extensive tooling to define the data schema, data transfomation rules and the 
              shape of the resulting API.
            </p>
          </ExpandContent>

          <ExpandContent title="Why should I use Subsquid?">
            <p className="text-fg-base--muted">The latency of serving the app data with a squid is much smaller compared to direct node access via gRPC which anables significantly better UX. The flexibility of 
            Squid SDK gives developers the full power to access and manipulate historical on-chain data and build complex and responsive dApps with familiar tools. 
            Finally, with the Aquairum cloud service the developers don't have to care about the maintainance of the indexing infrastructure.
            </p>
          </ExpandContent>

          <ExpandContent
            title="How much does Subsquid cost?">
            <p className="text-fg-base--muted">The Squid SDK is open source. Access to public Archives maintained by Subsquid Labs is free of charge. Following our TGE and mainnet launch, the price of archive queries will be determined by an open market.
            The basic plan for deploying squids to Aquarium is free and always will be, with some premium features to be introduced in the future.
            </p>
          </ExpandContent>

          <ExpandContent
            title="What is an Archive?">
            <p className="text-fg-base--muted">Archives ingest and store the full log of historical on-chain data in a normalized way. 
            Archives serve on-chain data with an API that supports batching over multiple blocks. 
            Archives are designed to be data sources for squids.</p>
          </ExpandContent>

          <ExpandContent
            title="What is Aquarium?">
            <p className="text-fg-base--muted"><a
              href="https://app.subsquid.io/aquarium/"
              target="_blank"
              className="text-fg-role--active">Aquarium</a> is a cloud service for hosting squids managed by Subsquid Labs.
              &nbsp;
              <a href="/deploy-squid/squid-cli" className="text-fg-role--active">Squid CLI</a> provides a convenient way to deploy and manage squids on Aquarium.
            </p>
          </ExpandContent>
        </div>

        <span className="body--s text-fg-base--muted">
          More questions? Check our extensive <a
          href="/faq">FAQ</a>
        </span>
      </div>
    </div>
  );
}
