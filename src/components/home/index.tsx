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
            description="Migrate to batch processor and improve sync times 10x">Migrate to FireSquid</TutorialCard>
        {/* <TutorialCard
            path=""
            description="Coming soon" 
  disabled={true}>Migrate From Subquery</TutorialCard> */} 
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <span className="heading--3 text-fg-base--muted">FAQ</span>

        <div className="flex flex-col gap--6">
          <ExpandContent title="What is Subsquid?">
            <p className="text-fg-base--muted">Subsquid is an on-chain indexing and querying solution that enables Web3
              builders to access on-chain data on their own terms. Featuring modular architecture and decentralized
              governance, this is the most developer-friendly and resource-efficient way to build, test, and deploy
              customized APIs for blockchain-facing applications.
            </p>
          </ExpandContent>

          <ExpandContent title="What is a Squid API?">
            <p className="text-fg-base--muted">
              Squid APIs are the data transformation component of the Subsquid data pipeline. They are composed of
              processors, which are responsible for retrieving and transforming data from Archives, and databases, which
              store that data until an application needs it. The data is sent through GraphQL gateways, which are
              separate servers that come built-in, and that provide interfaces for entities in the data store.
            </p>
          </ExpandContent>

          <ExpandContent title="Why should I use Subsquid?">
            <p className="text-fg-base--muted">Subsquid offers the tools you need to build the best possible backend for
              your blockchain-facing application. Reduce the time it takes for you to iterate as you develop new
              features with fast-syncing middleware, and do more with the industry's most flexible API framework.
              Explore Squid projects in <a
                href="https://app.subsquid.io/aquarium/"
                target="_blank"
                className="text-fg-role--active">the Aquarium</a> to see just a few of the bespoke features that are
              possible with
              Subsquids.
            </p>
          </ExpandContent>

          <ExpandContent title="How can I get started with Subsquid?">
            <p className="text-fg-base--muted">
              The best place to get started is our quickstart tutorial, which will bring you from cloning the Squid
              template and adding some simple logic to deploying it locally for basic queries. If you require help, feel
              free to join our friendly SquidDevs community.
            </p>
          </ExpandContent>

          <ExpandContent
            title="How much does Subsquid cost?">
            <p className="text-fg-base--muted">The Subsquid SDK, indexing solution, and hosted service are all
              free-to-use at the current time. Following our TGE and mainnet launch, pricing will be determined by the
              decentralized marketplace of infrastructure providers. We expect, given Subsquid's architecture, that
              service costs will be at least 10 times lower than industry standards.
            </p>
          </ExpandContent>

          <ExpandContent
            title="What is an Archive?">
            <p className="text-fg-base--muted">In the Subsquid data pipeline, Archives are the data source. In other
              words, Archives are the software that gathers historical blockchain data, converting it into a format that
              Squid APIs can easily process. These data sources can be shared by any number of Squids.</p>
          </ExpandContent>

          <ExpandContent
            title="What is the Aquarium?">
            <p className="text-fg-base--muted">The <a
              href="https://app.subsquid.io/aquarium/"
              target="_blank"
              className="text-fg-role--active">Aquarium</a> is a public gallery of Squids that gives free access to the
              data collected by some of Web3's top projects. In addition to serving as a data explorer, the Aquarium is
              also Subsquid's free hosted service.
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
