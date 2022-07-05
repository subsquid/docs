import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { ContentFeature } from '@site/src/components/content-feature';
import { TutorialCard } from '@site/src/components/tutorial-card';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const DevelopSquidImage = require('@site/static/img/develop-squid.svg').default;
const RunSquidImage = require('@site/static/img/run-squid.svg').default;
const QuerySquidImage = require('@site/static/img/query-squid.svg').default;
const DeploySquidImage = require('@site/static/img/deploy-squid.svg').default;

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();


  if (ExecutionEnvironment.canUseDOM) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="This documentation provides information for all degrees of expertise, varying from complete beginner, to those who only need a refresher on specific commands.">
      <main className="w-full max-w-[1128px] xl:max-w-[1280px] xl:max-w-[1360px] wide:max-w-[1480px] mx-auto">
        <div className="flex flex-col gap-4 max-w-[476px] items-start self-start mb-24">
          <h3 className="heading--3">Subsquid Docs</h3>
          <div className="flex flex-col gap-6">
            <p className="body--s">This documentation provides information for all degrees of expertise, varying from
              complete beginner, to those who only need a refresher on specific commands.</p>
            <a
              className="x-button bg-bg-base--contrast text-fg-base--contrast"
              href="/docs/quickstart">Quickstart</a>
          </div>
        </div>

        <section className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2 mb-28">

          <ContentFeature
            image={DevelopSquidImage}
            links={[
              {
                url: '/docs/develop-a-squid/define-a-squid-schema',
                label: 'Define a Squid Schema'
              },
              {
                url: '/docs/develop-a-squid/schema-updates',
                label: 'Schema updates'
              },
              {
                url: '/docs/develop-a-squid/squid-processor',
                label: 'Processor'
              },
              {
                url: '/docs/develop-a-squid/batch-processing',
                label: 'Batch processing'
              },
              {
                url: '/docs/develop-a-squid/storage-calls',
                label: 'Storage calls'
              },
              {
                url: '/docs/develop-a-squid',
                label: 'View more'
              }
            ]}>Develop Squid</ContentFeature>

          <ContentFeature
            image={RunSquidImage}
            links={[
              {
                url: '/docs/run-squid',
                label: 'Run a squid locally'
              },
              {
                url: '/docs/run-squid/run-in-docker',
                label: 'Run in Docker'
              }
            ]}>Run a Squid</ContentFeature>


          <ContentFeature
            image={DeploySquidImage}
            links={[
              {
                url: '/docs/deploy-squid/',
                label: 'Step by step guide'
              },
              {
                url: 'docs/deploy-squid/squid-cli',
                label: 'Squid CLI Reference'
              }
            ]}>Deploy Squid</ContentFeature>

          <ContentFeature
            image={QuerySquidImage}
            links={[
              {
                url: '/docs/query-squid/api-extensions',
                label: 'API Extensions'
              },
              {
                url: '/docs/query-squid/openreader-queries/and-or-filters',
                label: 'OpenReader Queries'
              },
              {
                url: '/docs/query-squid/openreader-schema/annotations-directives',
                label: 'OpenReader Schema'
              },
              {
                url: '/docs/query-squid/paginate-query-results',
                label: 'Paginate query results'
              },
              {
                url: '/docs/query-squid/queries',
                label: 'Queries'
              },
              {
                url: '/docs/query-squid/',
                label: 'View more'
              }
            ]}>Query a Squid</ContentFeature>
        </section>

        <div className="flex flex-col gap-12 items-center">
          <h3 className="heading--3 text--center">Tutorials</h3>

          <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 gap-2">
            <TutorialCard
              path="/docs/tutorials/create-a-simple-squid"
              description="This tutorial will take the Squid template and go through all the necessary steps to customize the project, in order to interact with a different Squid Archive, synchronized with a different blockchain, and process data from Events different from the ones in the template.">Create
              a simple Squid</TutorialCard>
            <TutorialCard
              path="/docs/tutorials/create-an-evm-processing-squid"
              description="This tutorial will take the Squid EVM template and go through all the necessary steps to customize the project, in order to interact with a different Squid Archive, synchronized with a different blockchain, and process data from Events different from the ones in the template.">Create
              an EVM-processing Squid</TutorialCard>
            <TutorialCard
              path="/docs/tutorials/deploy-your-squid"
              description="Subsquid offers a Software as a Service (SaaS) hosting, to further accelerate the development and reduce obstacles. This way, builders can focus on coding their business logic into the APIs, without having to worry about deployment and hosting.">Deploy
              your first Squid</TutorialCard>
            <TutorialCard
              path="/docs/tutorials/development-environment-set-up"
              description="Set up node and docker">Development Environment set up</TutorialCard>
          </div>
        </div>
      </main>
    </Layout>
  );
}
