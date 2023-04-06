import React, {useState} from 'react';
import {Markprompt} from "markprompt";
import "./index.css";
import clsx from "clsx";

export function Bot(): JSX.Element {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isFullscrenn, setIsFullscrenn] = useState(false);

    const setFullscreen = (value: boolean = false) => {
        setIsFullscrenn(value)
    }

    const setDialog = (value: boolean = false) => {
        setIsOpenDialog(value)
        setIsFullscrenn(false)
    }

    return <>
        <div className={clsx("Bot", {
            "Bot--open": isOpenDialog,
            "Bot--fullscreen": isFullscrenn
        })}>
            <div className="BotFloating" onClick={() => setDialog(true)}>
                <div className="BotFloating__message">
                    <p>Hello! <br/><br/>My name is Thaddeus. I know these<br/>docs better than anyone. Yes, I’m a bot,<br/>but think of me more like your personal<br/>Subsquid assistant.<br/><br/>Ask me a question.</p>
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
                        {isFullscrenn === true ? <button className="Bot__minus Bot__tool" onClick={() => setFullscreen(false)}><img src="/img/minus.svg" alt=""/></button> : <button className="Bot__fullsize Bot__tool" onClick={() => setFullscreen(true)}><img src="/img/maximize.svg" alt=""/></button>}
                        <button className="Bot__close Bot__tool" onClick={() => setDialog(false)}><img src="/img/close.svg" alt=""/></button>
                    </div>
                </div>
                <div className="Bot__main">
                    <Markprompt
                        projectKey="Vf7NLfOpfMQeKH8kQfx6qhdEmCvzsxJ0"
                        model="gpt-4"
                        iDontKnowMessage="Sorry, I don't know!"
                        placeholder="Ask the Subsquid bot!"/>
                </div>
            </div>
        </div>
    </>;
}