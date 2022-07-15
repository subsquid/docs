import React from 'react';
import { ContentFeature } from '@site/src/components/content-feature';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { GuideCard } from '@site/src/components/guide-card';

export default function Home(): JSX.Element {

  if (ExecutionEnvironment.canUseDOM) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  return (
    <div>
      <div className="flex flex-col gap-4 max-w-[476px] items-start self-start mb-24">
        <span className="heading--3">Subsquid Docs</span>
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
            image="/img/scroll-emoji.png"
            title="About Subsquid">
            Get to know our project and discover what's possible
            <a
              href=""
              className="link"> with Subsquid</a>
          </ContentFeature>

          <ContentFeature
            image="/img/scroll-emoji.png"
            title="Build a Squid API">
            Use your own custom logic and build with Web3's best
            <a
              href=""
              className="link"> API framework</a>
          </ContentFeature>

          <ContentFeature
            image="/img/scroll-emoji.png"
            title="Run a Squid API">
            Build with Docker to run your API locally with enhanced
            <a
              href=""
              className="link"> metrics</a>
          </ContentFeature>

          <ContentFeature
            image="/img/scroll-emoji.png"
            title="Hosted Service">
            Release your Squid (at zero cost) into
            the waters of
            <a
              href=""
              className="link"> the Aquarium</a>
          </ContentFeature>

          <ContentFeature
            image="/img/scroll-emoji.png"
            title="Query Squids">
            Discover GraphQL and learn to execute custom queries
            <a
              href=""
              className="link"> automagically</a>
          </ContentFeature>

          <ContentFeature
            image="/img/scroll-emoji.png"
            title="Dev Support">
            Get your questions answered and connect with other
            <a
              href=""
              className="link"> SquidDevs</a>
          </ContentFeature>

        </div>
      </section>

      <div className="flex flex-col gap-12">
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

      <div className="flex flex-col gap-12">
        <span className="heading--3 text-fg-base--muted">FAQ</span>

        <div className="flex flex-col gap--6">

        </div>
      </div>
    </div>
  );
}
