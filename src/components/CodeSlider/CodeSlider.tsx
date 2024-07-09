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

    const [slides, setSlides] = useState(props.slides || []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [swiper, setSwiper] = useState(null);
    const codeRef = useRef(null)
    const paginationRef = useRef(null)
    const nextRef = useRef(null)
    const prevRef = useRef(null)
    const linkRef = useRef(null)

    useEffect(() => {
        const isDark: boolean = colorMode === 'dark'

        if (isDark) {
            setStyle(stackoverflowDark)
        } else {
            setStyle(vs)
        }
    })


    const handleClickExpand = () => {
        setIsExpanded(!isExpanded)

        setTimeout(() => {
            // @ts-ignore
            swiper.updateAutoHeight(200)
        }, 100)
    }

    return <>
        <div className={clsx('code-slider bg-bg-base--subtle p-5 rounded-lg')}>
            <div className={clsx('flex items-center gap-3 code-slider__nav')}>
                <button className="code-slider__arrow" ref={prevRef}>{ChevronLeftSvg}</button>
                <button className="code-slider__arrow" ref={nextRef}>{ChevronRightSvg}</button>
            </div>

            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                onSlideChange={(s) => {
                    linkRef.current.setAttribute('href', s.slides[s.activeIndex].getAttribute('data-link') || "#")
                }}
                spaceBetween={20}
                navigation={{
                    enabled: true,
                    nextEl: nextRef.current,
                    prevEl: prevRef.current
                }}
                loop={true}
                allowTouchMove={false}
                autoplay={{delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: true}}
                pagination={{clickable: true, el: paginationRef.current}}
                autoHeight={true} onSwiper={setSwiper}>
                {slides.map((slide, index) => <SwiperSlide data-link={slide.link} key={index}>
                    <h3 className={clsx('body--m mb-4 code-slider__title')}>{slide.title}</h3>

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
                    <div className="code-slider__pagination" ref={paginationRef}></div>
                </div>

                <div className={clsx('flex items-center gap-3 sm:gap-7 md:gap-3 mb-4 md:mb-0')}>
                    <div
                        className={clsx('flex items-center gap-3 sm:gap-7 md:gap-3 code-slider__stage', {'code-slider__stage--visible': isExpanded})}>
                        <a ref={linkRef} href={slides[0].link} target="_blank"
                           className={clsx('text-fg-role--accent-02')}>Full squid</a>
                        <span className="code-slider__line"></span>
                        <Link to='/sdk/examples/?tags=["Showcase"]'
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
