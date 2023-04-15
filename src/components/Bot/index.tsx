import React from 'react';
import {Markprompt} from "markprompt";
import "./index.css";
import clsx from "clsx";
import lottie from "lottie-web";

function waitForElm(selector) {
    return new Promise(resolve => {
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

export class Bot extends React.Component<{}, { isOpenDialog: boolean, isFullscrenn: boolean, isLoading: boolean, isMessageShow: boolean, isShowMessage: boolean }> {
    constructor(props) {
        super(props);

        this.state = {
            isOpenDialog: false,
            isFullscrenn: false,
            isLoading: false,
            isMessageShow: false,
            isShowMessage: true
        }
    }

    componentDidMount() {
        const form: HTMLFormElement = document.querySelector('.Bot form')

        const button = document.createElement('button')
        button.type = "submit"
        button.className = "Bot__submit"
        button.innerHTML = "<img class='Bot__success' src='/img/enter.svg' alt=''/>"

        form.appendChild(button)

        if (form) {
            form.addEventListener('submit', async () => {
                this.setState({isLoading: true})

                const waitIsDone = await waitForElm('.Bot .prompt-answer-done')

                if (waitIsDone) {
                    this.setState({isLoading: false})
                }
            })
        }

        lottie.loadAnimation({
            container: document.getElementById('loading'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: "/lottie/loading.json"
        });
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

    setShowMessage(val: boolean = false) {
        this.setState({isShowMessage: val})
    }

    render() {
        return <>
            <div className={clsx("Bot", {
                "Bot--open": this.state.isOpenDialog,
                "Bot--fullscreen": this.state.isFullscrenn,
                "Bot--loading": this.state.isLoading
            })}>
                <div className="BotFloating">
                    {this.state.isShowMessage ? <div className="BotFloating__message">
                        <p onClick={() => this.setDialog(true)}>Hello! <br/><br/>My name is Thaddeus. I know these<br/>docs
                            better than anyone. Yes, I’m a
                            bot,<br/>but think of me more like your personal<br/>Subsquid assistant.<br/><br/>Ask me a
                            question.</p>
                        <img onClick={() => this.setDialog(true)} src="/img/robot.png" alt=""
                             className="BotFloating__icon16x"/>
                        <img onClick={() => this.setShowMessage(false)} src="/img/x.svg" alt=""
                             className="BotFloating__close"/>
                    </div> : ""}

                    <img onClick={() => this.setDialog(true)} src="/img/bot-logo.svg" alt=""
                         className="BotFloating__logotype"/>
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
                    <div className={clsx("Bot__main", {
                        "Bot__main--loading": this.state.isLoading,
                    })}>
                        {!this.state.isMessageShow ? <p className="Bot__message">Hello! I’m Thaddeus! 🦑
                            I’m programmed to answer your <br/>questions about Subsquid.<br/><br/>Ask me things
                            like:<br/>”How do I build my first squid?”<br/>”Why is Subsquid better than the Graph?”<br/>”Where
                            can I find an example of IPFS indexing?” </p> : ""}

                        <div id="loading" className={clsx({
                            "loading": this.state.isLoading,
                        })}></div>
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