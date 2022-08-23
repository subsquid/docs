// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Subsquid',
    tagline: 'This documentation provides information for all degrees of expertise, varying from complete beginner, to those who only need a refresher on specific commands.',
    url: 'https://docs.subsquid.io/',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    staticDirectories: ['static'],

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'subsquid', // Usually your GitHub org/user name.
    projectName: 'squid', // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/',
                    lastVersion: 'current',
                    versions: {
                        current: {
                            label: 'Firesquid',
                            path: '/'
                        }
                    },
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/subsquid/docs/edit/master/'
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
                gtag: {
                    trackingID: 'G-WMH2V85G1B',
                    anonymizeIP: true,
                },
            }),
        ],

    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                logo: {
                    alt: 'Subsquid',
                    src: 'img/logo-light.svg',
                    srcDark: 'img/logo-dark.svg',
                },
                items: [],
                hideOnScroll: true
            },
            colorMode: {
                defaultMode: 'light'
            },
            footer: {},
            prism: {
                theme: lightCodeTheme,
                darkTheme: {
                    ...darkCodeTheme,
                    plain: {
                        color: "var(--fg-base--default)",
                        backgroundColor: "var(--bg-base--indistinguishable)"
                    }
                },
            },
        }),

    plugins: [
        async function tailWindCssPlugin(context, options) {
            return {
                name: 'docusaurus-tailwindcss',
                configurePostCss(postcssOptions) {
                    // Appends TailwindCSS and AutoPrefixer.
                    postcssOptions.plugins.push(require("tailwindcss"));
                    postcssOptions.plugins.push(require("autoprefixer"));
                    return postcssOptions;
                },
            };
        },
    ]
};

module.exports = config;
