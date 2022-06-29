import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { ContentFeature } from '@site/src/components/content-feature';
import { GuideCard } from '@site/src/components/guide-card';
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
              className="rounded-lg body--s text-fg-base--contrast py-2 px-6 bg-bg-base--contrast w-fit"
              href="/docs/quickstart">Quickstart</a>
          </div>
        </div>

        <section className="grid grid-cols-3 grid-rows-2 gap-2 mb-28">

          <ContentFeature
            image={DevelopSquidImage}
            links={[
              {
                url: '',
                label: 'Architecture'
              },
              {
                url: '',
                label: 'Processor'
              },
              {
                url: '',
                label: 'Substrate'
              },
              {
                url: '',
                label: 'Typegen'
              }
            ]}>Develop Squid</ContentFeature>

          <ContentFeature
            image={RunSquidImage}
            links={[
              {
                url: '',
                label: 'Development Environment set up'
              },
              {
                url: '',
                label: 'Create a simple Squid'
              },
              {
                url: '',
                label: 'Create an EVM-processing Squid'
              },
              {
                url: '',
                label: 'GraphQL'
              },
              {
                url: '',
                label: 'Deploy your first Squid'
              }
            ]}>Run Squid</ContentFeature>

          <ContentFeature
            image={QuerySquidImage}
            links={[
              {
                url: '',
                label: 'Giant Squid API'
              },
              {
                url: '',
                label: 'Migrate to v5'
              },
              {
                url: '',
                label: 'How to launch an Archive'
              },
              {
                url: '',
                label: 'Running a Squid'
              },
              {
                url: '',
                label: 'Deploying a Squid'
              }
            ]}>Query Squid</ContentFeature>
          <ContentFeature
            image={DeploySquidImage}
            links={[
              {
                url: '',
                label: 'Squid CLI Reference'
              },
              {
                url: '',
                label: 'OpenReader Schema'
              },
              {
                url: '',
                label: 'OpenReader Queries'
              },
              {
                url: '',
                label: 'API Extensions'
              },
              {
                url: '',
                label: 'Substrate Processor'
              }
            ]}>Deploy Squid</ContentFeature>
        </section>

        <div className="flex flex-col gap-12 items-center mb-28">
          <h3 className="heading--3 text--center">Guide</h3>

          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <GuideCard
              description="Text here"
              color="bg-role--notice">Balance Transfers</GuideCard>
            <GuideCard
              description="Text here"
              color="bg-role--building">Balance Transfers Batched</GuideCard>
            <GuideCard
              description="Text here"
              color="bg-role--success">RMRK collections and statistics</GuideCard>
            <GuideCard
              description="Text here"
              color="bg-role--warning">Moonsama NFT tracker</GuideCard>
            <GuideCard
              description="Text here"
              color="bg-role--syncing">Staking rewards tracker</GuideCard>
            <GuideCard
              description="Text here"
              color="bg-role--info">XCM tracker</GuideCard>
          </div>
        </div>

        <div className="flex flex-col gap-12 items-center">
          <h3 className="heading--3 text--center">Tutorials</h3>

          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <TutorialCard
              description="Text here">Migrate from v5</TutorialCard>
            <TutorialCard
              description="Text here">Migrate from SubQuery</TutorialCard>
            <TutorialCard
              description="Text here">Migrate from TheGraph (TBD)</TutorialCard>
            <TutorialCard
              description="Text here">Performance optimization</TutorialCard>
          </div>
        </div>
      </main>
    </Layout>
  );
}
