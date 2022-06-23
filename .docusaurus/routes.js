import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'fae'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'dcd'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '2fa'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '8b1'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '2bf'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '6f7'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '557'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'e4b'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '5c3'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '516'),
    exact: true
  },
  {
    path: '/blog/greetings',
    component: ComponentCreator('/blog/greetings', 'f8a'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', '935'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', '53f'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', 'e78'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '8a9'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '6aa'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '30a'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '765'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', 'e88'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', 'ebf'),
    exact: true
  },
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', 'fdb'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'a8c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/',
        component: ComponentCreator('/docs/faq/', 'dd0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/bug-reporting-guidelines',
        component: ComponentCreator('/docs/faq/bug-reporting-guidelines', '4b6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-do-i-decode-the-event-data-and-how-to-deal-with-runtime-upgrades',
        component: ComponentCreator('/docs/faq/how-do-i-decode-the-event-data-and-how-to-deal-with-runtime-upgrades', '514'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-do-i-deploy-my-api-to-the-subsquid-hosted-service',
        component: ComponentCreator('/docs/faq/how-do-i-deploy-my-api-to-the-subsquid-hosted-service', '1b1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-do-i-know-which-events-and-extrinsics-i-need-for-the-handlers',
        component: ComponentCreator('/docs/faq/how-do-i-know-which-events-and-extrinsics-i-need-for-the-handlers', '386'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-do-i-run-and-test-the-graphql-api',
        component: ComponentCreator('/docs/faq/how-do-i-run-and-test-the-graphql-api', '0a1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-do-i-start-the-processor',
        component: ComponentCreator('/docs/faq/how-do-i-start-the-processor', '9ef'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-do-i-update-my-schema',
        component: ComponentCreator('/docs/faq/how-do-i-update-my-schema', '1e2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-do-i-write-the-schema',
        component: ComponentCreator('/docs/faq/how-do-i-write-the-schema', 'a0e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/how-to-run-a-processor-against-a-different-chain',
        component: ComponentCreator('/docs/faq/how-to-run-a-processor-against-a-different-chain', 'a7a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/faq/where-do-i-get-a-type-bundle-for-my-chain',
        component: ComponentCreator('/docs/faq/where-do-i-get-a-type-bundle-for-my-chain', '6ad'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/key-concepts/',
        component: ComponentCreator('/docs/key-concepts/', 'a13'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/key-concepts/architecture',
        component: ComponentCreator('/docs/key-concepts/architecture', '769'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/key-concepts/processor',
        component: ComponentCreator('/docs/key-concepts/processor', '45b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/key-concepts/substrate',
        component: ComponentCreator('/docs/key-concepts/substrate', 'ba2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/key-concepts/typegen',
        component: ComponentCreator('/docs/key-concepts/typegen', 'bd9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/mappings/',
        component: ComponentCreator('/docs/mappings/', '7a5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/mappings/substrateevent',
        component: ComponentCreator('/docs/mappings/substrateevent', '46b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/quickstart',
        component: ComponentCreator('/docs/quickstart', '1f0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/',
        component: ComponentCreator('/docs/recipes/', '457'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/deploying-a-squid/',
        component: ComponentCreator('/docs/recipes/deploying-a-squid/', 'f44'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/deploying-a-squid/maintaining-multiple-versions',
        component: ComponentCreator('/docs/recipes/deploying-a-squid/maintaining-multiple-versions', '654'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/deploying-a-squid/monitoring-and-sync-status',
        component: ComponentCreator('/docs/recipes/deploying-a-squid/monitoring-and-sync-status', '1f6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/deploying-a-squid/obtaining-a-deployment-key',
        component: ComponentCreator('/docs/recipes/deploying-a-squid/obtaining-a-deployment-key', '9e6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/deploying-a-squid/releasing-a-squid-version',
        component: ComponentCreator('/docs/recipes/deploying-a-squid/releasing-a-squid-version', '801'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/deploying-a-squid/updating-a-squid',
        component: ComponentCreator('/docs/recipes/deploying-a-squid/updating-a-squid', '7f2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/giant-squid-api/',
        component: ComponentCreator('/docs/recipes/giant-squid-api/', '297'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/giant-squid-api/client-example',
        component: ComponentCreator('/docs/recipes/giant-squid-api/client-example', '945'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/giant-squid-api/queries',
        component: ComponentCreator('/docs/recipes/giant-squid-api/queries', '67e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/how-to-launch-a-squid-archive',
        component: ComponentCreator('/docs/recipes/how-to-launch-a-squid-archive', 'bce'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/migrate-to-v5',
        component: ComponentCreator('/docs/recipes/migrate-to-v5', '6b5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/',
        component: ComponentCreator('/docs/recipes/running-a-squid/', '370'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/building-with-docker',
        component: ComponentCreator('/docs/recipes/running-a-squid/building-with-docker', 'b9b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/define-a-squid-schema',
        component: ComponentCreator('/docs/recipes/running-a-squid/define-a-squid-schema', '394'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/generate-typescript-definitions',
        component: ComponentCreator('/docs/recipes/running-a-squid/generate-typescript-definitions', '313'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/local-runs',
        component: ComponentCreator('/docs/recipes/running-a-squid/local-runs', 'b40'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/multi-chain-processors',
        component: ComponentCreator('/docs/recipes/running-a-squid/multi-chain-processors', '71e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/prometheus-metrics',
        component: ComponentCreator('/docs/recipes/running-a-squid/prometheus-metrics', '854'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/recipes/running-a-squid/schema-updates',
        component: ComponentCreator('/docs/recipes/running-a-squid/schema-updates', '29a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/',
        component: ComponentCreator('/docs/reference/', '123'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/api-extensions',
        component: ComponentCreator('/docs/reference/api-extensions', 'c99'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/evm-processor',
        component: ComponentCreator('/docs/reference/evm-processor', 'a93'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/handler-functions/',
        component: ComponentCreator('/docs/reference/handler-functions/', 'f32'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/handler-functions/context-interfaces',
        component: ComponentCreator('/docs/reference/handler-functions/context-interfaces', '87c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/handler-functions/handler-interfaces',
        component: ComponentCreator('/docs/reference/handler-functions/handler-interfaces', '30b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/handler-functions/handler-options-interfaces',
        component: ComponentCreator('/docs/reference/handler-functions/handler-options-interfaces', '37b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/handler-functions/runtime-upgrades',
        component: ComponentCreator('/docs/reference/handler-functions/runtime-upgrades', 'a80'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-queries/',
        component: ComponentCreator('/docs/reference/openreader-queries/', '20f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-queries/and-or-filters',
        component: ComponentCreator('/docs/reference/openreader-queries/and-or-filters', '23f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-queries/cross-relation-field-queries',
        component: ComponentCreator('/docs/reference/openreader-queries/cross-relation-field-queries', '558'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-queries/json-queries',
        component: ComponentCreator('/docs/reference/openreader-queries/json-queries', 'c86'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-queries/nested-field-queries',
        component: ComponentCreator('/docs/reference/openreader-queries/nested-field-queries', '21d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-queries/resolve-union-types-interfaces',
        component: ComponentCreator('/docs/reference/openreader-queries/resolve-union-types-interfaces', 'bc5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-queries/string-regex-queries',
        component: ComponentCreator('/docs/reference/openreader-queries/string-regex-queries', 'f79'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/',
        component: ComponentCreator('/docs/reference/openreader-schema/', '3ee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/annotations-directives',
        component: ComponentCreator('/docs/reference/openreader-schema/annotations-directives', '84e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/bigint-fields',
        component: ComponentCreator('/docs/reference/openreader-schema/bigint-fields', '10c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/bytes-fields',
        component: ComponentCreator('/docs/reference/openreader-schema/bytes-fields', '0ed'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/datetime-fields',
        component: ComponentCreator('/docs/reference/openreader-schema/datetime-fields', 'fd9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/entity-relations',
        component: ComponentCreator('/docs/reference/openreader-schema/entity-relations', '159'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/full-text-search',
        component: ComponentCreator('/docs/reference/openreader-schema/full-text-search', '69a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/interfaces',
        component: ComponentCreator('/docs/reference/openreader-schema/interfaces', 'ff2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/json-fields',
        component: ComponentCreator('/docs/reference/openreader-schema/json-fields', 'fdc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/openreader-schema/union-types',
        component: ComponentCreator('/docs/reference/openreader-schema/union-types', '320'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-cli/',
        component: ComponentCreator('/docs/reference/squid-cli/', 'a85'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-cli/auth',
        component: ComponentCreator('/docs/reference/squid-cli/auth', '5ba'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-cli/codegen',
        component: ComponentCreator('/docs/reference/squid-cli/codegen', '59a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-cli/db',
        component: ComponentCreator('/docs/reference/squid-cli/db', '89f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-cli/help',
        component: ComponentCreator('/docs/reference/squid-cli/help', 'd8d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-cli/installation',
        component: ComponentCreator('/docs/reference/squid-cli/installation', '5d7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-cli/squid',
        component: ComponentCreator('/docs/reference/squid-cli/squid', 'b36'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-evm-typegen',
        component: ComponentCreator('/docs/reference/squid-evm-typegen', 'e0a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-substrate-metadata-explorer',
        component: ComponentCreator('/docs/reference/squid-substrate-metadata-explorer', '302'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/squid-substrate-typegen',
        component: ComponentCreator('/docs/reference/squid-substrate-typegen', 'c02'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/storage-calls',
        component: ComponentCreator('/docs/reference/storage-calls', 'c02'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/store-interface',
        component: ComponentCreator('/docs/reference/store-interface', '3f1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reference/substrate-processor',
        component: ComponentCreator('/docs/reference/substrate-processor', '71a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/',
        component: ComponentCreator('/docs/tutorial/', 'e56'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/create-a-simple-squid',
        component: ComponentCreator('/docs/tutorial/create-a-simple-squid', '9b8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/create-an-evm-processing-squid',
        component: ComponentCreator('/docs/tutorial/create-an-evm-processing-squid', '69b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/deploy-your-squid',
        component: ComponentCreator('/docs/tutorial/deploy-your-squid', '2e8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/development-environment-set-up',
        component: ComponentCreator('/docs/tutorial/development-environment-set-up', '613'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/graphql/',
        component: ComponentCreator('/docs/tutorial/graphql/', 'a0e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/graphql/paginate-query-results',
        component: ComponentCreator('/docs/tutorial/graphql/paginate-query-results', '398'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/graphql/queries',
        component: ComponentCreator('/docs/tutorial/graphql/queries', 'af0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/graphql/sorting',
        component: ComponentCreator('/docs/tutorial/graphql/sorting', 'd4f'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/docs/v5',
    component: ComponentCreator('/docs/v5', 'ab0'),
    routes: [
      {
        path: '/docs/v5/',
        component: ComponentCreator('/docs/v5/', '549'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '1af'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
