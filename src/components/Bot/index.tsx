import React, {useState} from 'react';
import {Markprompt} from "markprompt";
import "./index.css";
import clsx from "clsx";

// const loadingEvent = new CustomEvent("bot_loading");
// const doneEvent = new CustomEvent("bot_done");

// waitForElm('.Bot .prompt-answer-loading').then((elm) => {
//     window.dispatchEvent(loadingEvent);
// });
//
// waitForElm('.Bot .prompt-answer-done').then((elm) => {
//     window.dispatchEvent(doneEvent);
// });
//
// function waitForElm(selector) {
//     return new Promise(resolve => {
//         const observer = new MutationObserver(mutations => {
//             if (document.querySelector(selector)) {
//                 resolve(document.querySelector(selector));
//             }
//         });
//
//         observer.observe(document.body, {
//             childList: true,
//             subtree: true
//         });
//     });
// }

export class Bot extends React.Component<{}, { isOpenDialog: boolean, isFullscrenn: boolean, isLoading: boolean, isMessageShow: boolean }> {
    constructor(props) {
        super(props);

        this.state = {
            isOpenDialog: false,
            isFullscrenn: false,
            isLoading: false,
            isMessageShow: false
        }
    }

    componentDidMount() {
        // window.addEventListener('bot_loading', () => {
        //     console.log("bot_loading")
        //     this.setState({isLoading: true})
        // })
        //
        // window.addEventListener('bot_done', () => {
        //     console.log("bot_done")
        //     this.setState({isLoading: false})
        // })
    }

    setFullscreen = (value: boolean = false) => {
        this.setState({isFullscrenn: value})
    }

    setDialog = (value: boolean = false) => {
        this.setState({isOpenDialog: value})
        this.setState({isFullscrenn: false})
    }

    setFirst() {
        this.setState({isMessageShow: true})
    }

    render() {
        return <>
            <div className={clsx("Bot", {
                "Bot--open": this.state.isOpenDialog,
                "Bot--fullscreen": this.state.isFullscrenn,
                "Bot--loading": this.state.isLoading
            })}>
                <div className="BotFloating" onClick={() => this.setDialog(true)}>
                    <div className="BotFloating__message">
                        <p>Hello! <br/><br/>My name is Thaddeus. I know these<br/>docs better than anyone. Yes, I’m a
                            bot,<br/>but think of me more like your personal<br/>Subsquid assistant.<br/><br/>Ask me a
                            question.</p>
                        <img src="/img/robot.png" alt="" className="BotFloating__icon16x"/>
                    </div>

                    <img src="/img/bot-logo.svg" alt="" className="BotFloating__logotype"/>
                </div>

                <div className="Bot__dialog">
                    <div className="Bot__header">
                        <div className="Bot__block">
                            <img src="/img/bot-logo.svg" alt="" className="Bot__logotype"/>
                            <div className="Bot__header-info">
                                <p className="Bot__name">Thaddeus 🦑</p>
                                <p className="Bot__desc">ChatGPT assistant</p>
                            </div>
                        </div>

                        <div className="Bot__tools">
                            {this.state.isFullscrenn === true ?
                                <button className="Bot__minus Bot__tool" onClick={() => this.setFullscreen(false)}><img
                                    src="/img/minus.svg" alt=""/></button> :
                                <button className="Bot__fullsize Bot__tool" onClick={() => this.setFullscreen(true)}>
                                    <img src="/img/maximize.svg" alt=""/></button>}
                            <button className="Bot__close Bot__tool" onClick={() => this.setDialog(false)}><img
                                src="/img/close.svg" alt=""/></button>
                        </div>
                    </div>
                    <div className="Bot__main">
                        {!this.state.isMessageShow ? <p className="Bot__message">Hello! I’m Thaddeus! 🦑
                            I’m programmed to answer your <br/>questions about Subsquid.<br/><br/>Ask me things
                            like:<br/>”How do I build my first squid?”<br/>”Why is Subsquid better than the Graph?”<br/>”Where
                            can I find an example of IPFS indexing?” </p> : ""}
                        <Markprompt
                            didCompleteFirstQuery={() => {
                                this.setFirst()
                            }}
                            projectKey="sk_test_Vf7NLfOpfMQeKH8kQfx6qhdEmCvzsxJ0"
                            model="gpt-4"
                            iDontKnowMessage="Sorry, I don't know!"
                            placeholder="Ask the Subsquid bot!"/>
                    </div>
                </div>
            </div>
        </>;
    }
}