import clsx from 'clsx';
import React, {useEffect, useRef, useState} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import "./CodeSlider.css"
import 'swiper/css';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination, Navigation, Autoplay} from "swiper/modules";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {vs, stackoverflowDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Link from "@docusaurus/Link";

const ChevronSvg = <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3.5 6.25L7 9.75L10.5 6.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round"/>
</svg>;

const ChevronLeftSvg = <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>;

const ChevronRightSvg = <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>;

export function CodeSlider(props: any) {
    const {colorMode} = useColorMode()
    const [style, setStyle] = useState(vs)

    useEffect(() => {
        const isDark: boolean = colorMode === 'dark'

        if (isDark) {
            setStyle(stackoverflowDark)
        } else {
            setStyle(vs)
        }
    })

    const [slides, setSlides] = useState(props.slides || [
        {
            title: "Transactions to and from a set of 1.4M wallets",
            code: 'export const processor = new EvmBatchProcessor()\n' +
                '  .setDataSource({\n' +
                '    archive: lookupArchive(\'binance\'),\n' +
                '  })\n' +
                '  .addTransaction({})\n' +
                '\n' +
                'const wallets: Set<string> = loadWallets()\n' +
                '// wallets.size can be very large (tested at 1.4M)\n' +
                '\n' +
                'processor.run(new TypeormDatabase(), async (ctx) => {\n' +
                '  for (let block of ctx.blocks) {\n' +
                '    for (let txn of block.transactions) {\n' +
                '      if (wallets.has(txn.from)) {\n' +
                '        // process a txn initiated by the wallet\n' +
                '      }\n' +
                '      if (txn.to && wallets.has(txn.to)) {\n' +
                '        // process a txn directed to the wallet\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '})',
            codeCollapse: '.setDataSource({ archive: lookupArchive(\'binance\') })\n.addTransaction({})\n// ...\nif (wallets.has(txn.from)) { /* ... */ }\nif (wallets.has(txn.to)) { /* ... */ }',
            link: "https://github.com/subsquid-labs/showcase00-analyzing-a-large-number-of-wallets"
        },
        {
            title: "USDC Transfers in real time",
            code: 'export const USDC_CONTRACT_ADDRESS = \'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\'\n' +
                '\n' +
                'export const processor = new EvmBatchProcessor()\n' +
                '  .setDataSource({\n' +
                '    archive: lookupArchive(\'eth-mainnet\'),\n' +
                '    chain: \'https://rpc.ankr.com/eth\',\n' +
                '  })\n' +
                '  .setFinalityConfirmation(75)\n' +
                '  .addLog({\n' +
                '    range: {from: 6_082_465},\n' +
                '    address: [USDC_CONTRACT_ADDRESS],\n' +
                '    topic0: [usdcAbi.events.Transfer.topic],\n' +
                '  })\n' +
                '  .setFields({\n' +
                '    log: {\n' +
                '      transactionHash: true,\n' +
                '    },\n' +
                '  })',
            codeCollapse: '.addLog({\n   address: [USDC_CONTRACT_ADDRESS],\n   topic0: [usdcAbi.events.Transfer.topic],\n})\n',
            caption: <>Real time data is fetched from a chain node RPC; a Database object with hot blocks support is
                required to store it (see <a href="#">this page</a> for more details</>,
            link: "https://github.com/subsquid-labs/showcase01-all-usdc-transfers"
        },
        {
            title: "All Transfers to vitalik.eth",
            code: 'export const VITALIK_ETH_TOPIC = \'0x000000000000000000000000\' +' +
                '\'d8da6bf26964af9d7eed9e03e53415d37aa96045\'\n' +
                '\n' +
                'export const processor = new EvmBatchProcessor()\n' +
                '  .setDataSource({\n' +
                '    archive: lookupArchive(\'eth-mainnet\'),\n' +
                '  })  .addLog({\n' +
                '    topic0: [erc20abi.events.Transfer.topic],\n' +
                '    topic2: [VITALIK_ETH_TOPIC],\n' +
                '  })',
            codeCollapse: '.addLog({\n' +
                '   topic0: [erc20abi.events.Transfer.topic],\n' +
                '   topic2: [VITALIK_ETH_TOPIC],\n' +
                '})\n',
            caption: <>All <b>Transfer(address,address,uint256)</b> will be captured, including ERC20 and ERC721
                transfers and possibly events with the same signature made with other protocols.</>,
            link: "https://github.com/subsquid-labs/showcase02-all-transfers-to-a-wallet"
        },
        {
            title: "Calls to AAVE Pool and all events they caused",
            code: 'export const AAVE_CONTRACT = \'0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9\'\n' +
                'export const processor = new EvmBatchProcessor()\n' +
                '  .setDataSource({\n' +
                '    archive: lookupArchive(\'eth-mainnet\'),\n' +
                '  })\n' +
                '  .setBlockRange({ from: 11_362_579 })\n' +
                '  .addTransaction({\n' +
                '    to: [AAVE_CONTRACT],\n' +
                '    logs: true,\n' +
                '  })\n' +
                '  .setFields({\n' +
                '    transaction: {\n' +
                '      value: true,\n' +
                '      sighash: true,\n' +
                '    },\n' +
                '    log: {\n' +
                '      transactionHash: true,\n' +
                '    },\n' +
                '  })',
            codeCollapse: '.addTransaction({\n' +
                '   to: [AAVE_CONTRACT],\n' +
                '   logs: true,\n' +
                '})\n',
            caption: <>Including events emitted by other contracts. Get ETH value involved in each call.</>,
            link: "https://github.com/subsquid-labs/showcase03-all-events-caused-by-contract-calls/"
        },
        {
            title: "All Mint events emitted anywhere on a chain",
            code: 'export const processor = new EvmBatchProcessor()\n' +
                '  .setDataSource({\n' +
                '    archive: lookupArchive(\'eth-mainnet\'),\n' +
                '  })\n' +
                '  .addLog({\n' +
                '    topic0: [usdcAbi.events.Mint.topic],\n' +
                '    transaction: true,\n' +
                '  })\n' +
                '  .setFields({\n' +
                '    transaction: {\n' +
                '      gasUsed: true,\n' +
                '    }\n' +
                '  })',
            codeCollapse: '.addLog({\n' +
                '   topic0: [usdcAbi.events.Mint.topic],\n' +
                '   transaction: true,\n' +
                '})\n',
            link: "https://github.com/subsquid-labs/showcase04-all-mint-events"
        },
        {
            title: "DEX trading pairs and Swap events",
            code: 'export const FACTORY_ADDRESSES = [  \'0xbcfccbde45ce874adcb698cc183debcf17952812\',  \'0xca143ce32fe78f1f7019d7d551a6402fc5350c73\',\n' +
                ']\n' +
                '\n' +
                'const PAIR_CREATED_TOPIC = \'0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9\'\n' +
                'const SWAP_TOPIC = \'0xd78ad95fa46c994b6551d0da85fc275 fe613ce37657fb8d5e3d130840159d822\'\n' +
                '\n' +
                'export const processor = new EvmBatchProcessor()\n' +
                '  .setDataSource({\n' +
                '    archive: lookupArchive(\'binance\'),\n' +
                '  })\n' +
                '  .setBlockRange({ from: 586_851 })\n' +
                '  .addLog({\n' +
                '    address: FACTORY_ADDRESSES,\n' +
                '    topic0: [PAIR_CREATED_TOPIC],\n' +
                '  })\n' +
                '  .addLog({\n' +
                '    topic0: [SWAP_TOPIC],\n' +
                '  })\n' +
                '  .setFields({\n' +
                '    log: {\n' +
                '      transactionHash: true,\n' +
                '    },\n' +
                '  })',
            codeCollapse: '.addLog({\n' +
                ' address: FACTORY_ADDRESSES,\n' +
                ' topic0: [PAIR_CREATED_TOPIC],\n' +
                ' })\n' +
                ' .addLog({ topic0: [SWAP_TOPIC] })',
            link: "https://github.com/subsquid-labs/showcase05-dex-pair-creation-and-swaps"
        },
        {
            title: "All calls to contract functions, including internal",
            code: 'const BAYC_ADDRESS = \'0xbc4ca0eda7647a8ab7c2061c2e118 a18a936f13d\'\n' +
                '\n' +
                'export const processor = new EvmBatchProcessor()  .setDataSource({\n' +
                '    archive: lookupArchive(\'eth-mainnet\'),\n' +
                '  })\n' +
                '  .setBlockRange({ from: 12_287_507 })\n' +
                '  .addTrace({\n' +
                '    type: [\'call\'],\n' +
                '    callTo: [BAYC_ADDRESS],\n' +
                '    transaction: true,\n' +
                '  })\n' +
                '  .addStateDiff({\n' +
                '    address: [BAYC_ADDRESS],\n' +
                '    transaction: true,\n' +
                '  })\n' +
                '  .setFields({\n' +
                '    trace: {\n' +
                '      callTo: true,\n' +
                '      callFrom: true,\n' +
                '      callSighash: true,\n' +
                '    },\n' +
                ' })',
            codeCollapse: '.addTrace({\n' +
                ' type: [\'call\'],\n' +
                ' callTo: [BAYC_ADDRESS],\n' +
                ' })\n' +
                ' .addStateDiff({ address: [BAYC_ADDRESS] })',
            caption: <>Call traces will expose any internal calls to BAYC by other contracts. Also retrieves all changes
                to contract storage state.</>,
            link: "https://github.com/subsquid-labs/showcase06-all-bayc-call-traces"
        },
        {
            title: "All NFT contract deployments and Transfers chain-wide",
            code: 'export const processor = new EvmBatchProcessor()\n' +
                '  .setDataSource({\n' +
                '    archive: lookupArchive(\'eth-mainnet\'),\n' +
                '  })\n' +
                '  .addTrace({\n' +
                '    type: [\'create\'],\n' +
                '    transaction: true,\n' +
                '  })\n' +
                '  .addLog({\n' +
                '    topic0: [erc721.events.Transfer.topic],\n' +
                '  })\n' +
                '  .setFields({\n' +
                '    trace: {\n' +
                '      createResultCode: true, // for checking ERC721 compliance\n' +
                '      createResultAddress: true,\n' +
                '    },\n' +
                '  })',
            codeCollapse: '.addTrace({\n' +
                ' type: [\'create\'],\n' +
                ' })\n' +
                ' .addLog({ topic0: [erc721.events.Transfer.topic] })\n',
            caption: <>All contract creations are scraped; they will be checked for ERC721 compliance in the batch
                handler. All ERC721 <b>Transfer</b> events are scraped so that they can be filtered and binned by the
                contract in the batch handler.</>,
            link: "https://github.com/subsquid-labs/showcase07-grab-all-nft-transfers"
        },
    ]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [swiper, setSwiper] = useState(142);
    const codeRef = useRef(null)
    const paginationRef = useRef(null)
    const nextRef = useRef(null)
    const prevRef = useRef(null)
    const linkRef = useRef(null)

    const handleClickExpand = () => {
        setIsExpanded(!isExpanded)

        setTimeout(() => {
            // @ts-ignore
            swiper.updateAutoHeight(200)
        }, 100)
    }

    return <>
        <div className={clsx('code-slider bg-bg-base--subtle p-5 rounded-lg')}>
            <Swiper
                onSlideChange={(s) => {
                    linkRef.current.setAttribute('href', s.slides[s.activeIndex].getAttribute('data-link') || "#")
                }} // @ts-ignore
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={20}
                navigation={{
                    enabled: true,
                    nextEl: nextRef.current,
                    prevEl: prevRef.current
                }}
                loop={true}
                breakpoints={{
                    0: {
                        allowTouchMove: false
                    },
                    833: {
                        allowTouchMove: true
                    }
                }}
                autoplay={{delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true}}
                pagination={{clickable: true, el: paginationRef.current}}
                autoHeight={true} onSwiper={setSwiper}>
                {slides.map((slide, index) => <SwiperSlide data-link={slide.link} key={index}>
                    <h3 className={clsx('body--m mb-4')}>{slide.title}</h3>

                    <div ref={codeRef}
                         className={clsx('bg-bg-base--default p-4 rounded-sm fs-14 font-normal font-mono-roboto code-slider__pre', {
                             'code-slider__pre--over': !isExpanded
                         })}>

                        {isExpanded
                            ? <SyntaxHighlighter language="typescript" style={style} children={slide.code}/>
                            : <SyntaxHighlighter language="typescript" style={style} children={slide.codeCollapse}/>
                        }
                    </div>

                    {slide.caption ?
                        <div className={clsx('code-slider__caption', {'code-slider__caption--expand': isExpanded})}>
                            <p>{slide.caption}</p></div> : undefined}
                </SwiperSlide>)}
            </Swiper>
            <div className={clsx('w-full flex mt-5 justify-between items-center md:flex-row flex-col-reverse')}>
                <div className={clsx('flex items-center gap-3')}>
                    <button ref={prevRef}>{ChevronLeftSvg}</button>
                    <div className="code-slider__pagination" ref={paginationRef}></div>
                    <button ref={nextRef}>{ChevronRightSvg}</button>
                </div>

                <div className={clsx('flex items-center gap-3 sm:gap-7 md:gap-3 mb-4 md:mb-0')}>
                    <div
                        className={clsx('flex items-center gap-3 sm:gap-7 md:gap-3 code-slider__stage', {'code-slider__stage--visible': isExpanded || window.innerWidth <= 833})}>
                        <a ref={linkRef} href={slides[0].link} target="_blank"
                           className={clsx('text-fg-role--accent-02')}>Full squid</a>
                        <span className="code-slider__line"></span>
                        <Link to="/evm-indexing/configuration/showcase/"
                              className={clsx('text-fg-role--accent-02')}>Showcase</Link>
                        <span className="code-slider__line"></span>
                    </div>

                    <button onClick={handleClickExpand}
                            className={clsx('code-slider__collapse', {'code-slider__collapse--expand': isExpanded})}>{isExpanded ? "Collapse" : "Expand"} {ChevronSvg}</button>
                </div>
            </div>
        </div>
    </>
}