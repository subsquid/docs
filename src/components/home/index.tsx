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
      <div className="flex flex-col gap-4 max-w-[476px] items-start self-start mb-24 pt-12">
        <span className="heading--3">Subsquid Docs
</span>
        <div className="flex flex-col gap-6">
          <p className="body--s">This documentation provides information for all degrees of expertise, varying from
            complete beginner, to those who only need a refresher on specific commands.</p>
          <a
            className="x-button bg-bg-base--contrast text-fg-base--contrast"
            href="/quickstart">Quickstart</a>
        </div>
      </div>

      <section className="flex flex-col gap-12 mb-28">
        <span className="heading--3 text-fg-base--muted">Get started</span>

        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
          <ContentFeature
            path=""
            image="/img/scroll-emoji.png"
            title="About Subsquid">
            Get to know our project and discover what's possible with Subsquid
          </ContentFeature>

          <ContentFeature
            path=""
            image="/img/squid-emoji.png"
            title="Build a Squid">
            Slice and dice on-chain data and present it with an expressive GraphQL API
          </ContentFeature>

          <ContentFeature
            path=""
            image="/img/gear-emoji.png"
            title="Run a Squid">
            Build with Docker to run your API locally
          </ContentFeature>

          <ContentFeature
            path=""
            image="/img/desktop-computer-emoji.png"
            title="Deploy a Squid">
            Release your Squid (at zero cost) into a cloud service for hosting squids
          </ContentFeature>

          <ContentFeature
            path=""
            image="/img/magic-wand-emoji.png"
            title="Query a Squid">
            A reference of GraphQL queries and filters exposed by a squid
          </ContentFeature>

          <ContentFeature
            path=""
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
            color={'bg-role--notice'}
            path="/tutorials/create-a-simple-squid"
            description="Learn how to build a simple Squid API to provide data to you application.">Create your first
            Squid</GuideCard>
          <GuideCard
            path="/tutorials/create-an-evm-processing-squid"
            color={'bg-role--notice'}
            description="Get started with the Aquarium, Subsquid’s free hosted service for Squid APIs. ">Deploy your
            first Squid</GuideCard>
          <GuideCard
            path="/tutorials/development-environment-set-up"
            color={'bg-role--warning'}
            description="Follow these steps in order to begin building with Subsquid.">Dev environment setup</GuideCard>
          <GuideCard
            path="/tutorials/deploy-your-squid"
            color={'bg-role--success'}
            description="Retrieve data from EVM chains like Moonbeam, Astar, and Acala.">EVM smart contract
            data</GuideCard>
          <GuideCard
            isDisabled={true}
            color={'bg-role--syncing'}
            description="Coming soon">WASM smart contract data</GuideCard>
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
            path="/guides/migrate-to-fire-squid"
            description="Text here">Migrate to FireSquid</TutorialCard>
          <TutorialCard
            path="/guides/migrate-to-fire-squid"
            description="Coming soon">Migrate From Subquery</TutorialCard>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <span className="heading--3 text-fg-base--muted">FAQ</span>

        <div className="flex flex-col gap--6">
          <ExpandContent title="What is Subsquid?">
            <p className="text-fg-base--muted">Subsquid is an on-chain indexing and querying solution that enables
              Web3 builders to gain access to on-chain data on their own terms. Featuring modular architecture and
              decentralised governance, this is the most developer-friendly and resource-efficient way to build, test,
              and
              deploy customised APIs for blockchain-facing applications.</p>
          </ExpandContent>

          <ExpandContent title="What is Subsquid?">
            <p className="text-fg-base--muted">Subsquid is an on-chain indexing and querying solution that enables
              Web3 builders to gain access to on-chain data on their own terms. Featuring modular architecture and
              decentralised governance, this is the most developer-friendly and resource-efficient way to build, test,
              and
              deploy customised APIs for blockchain-facing applications.</p>
          </ExpandContent>

          <ExpandContent title="What is Subsquid?">
            <p className="text-fg-base--muted">Subsquid is an on-chain indexing and querying solution that enables
              Web3 builders to gain access to on-chain data on their own terms. Featuring modular architecture and
              decentralised governance, this is the most developer-friendly and resource-efficient way to build, test,
              and
              deploy customised APIs for blockchain-facing applications.</p>
          </ExpandContent>

          <ExpandContent title="What is Subsquid?">
            <p className="text-fg-base--muted">Subsquid is an on-chain indexing and querying solution that enables
              Web3 builders to gain access to on-chain data on their own terms. Featuring modular architecture and
              decentralised governance, this is the most developer-friendly and resource-efficient way to build, test,
              and
              deploy customised APIs for blockchain-facing applications.</p>
          </ExpandContent>

          <ExpandContent title="What is Subsquid?">
            <p className="text-fg-base--muted">Subsquid is an on-chain indexing and querying solution that enables
              Web3 builders to gain access to on-chain data on their own terms. Featuring modular architecture and
              decentralised governance, this is the most developer-friendly and resource-efficient way to build, test,
              and
              deploy customised APIs for blockchain-facing applications.</p>
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
