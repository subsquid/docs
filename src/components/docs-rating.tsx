import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, {useState} from 'react';

const DocsRating = () => {
    if (!ExecutionEnvironment.canUseDOM) {
        return null;
    }

    const [haveVoted, setHaveVoted] = useState(!!(localStorage.getItem(window.location.href)));
    const giveFeedback = value => {
        // @ts-ignore
        if (window.gtag) {
            // @ts-ignore
            window.gtag('event', 'like', {
                event_label: "like",
                value: value
            });
        }

        setHaveVoted(true)
        localStorage.setItem(window.location.href, value)
    };

    return (
        <div className="docsRating">
            {haveVoted ? (
                <>
                    <div className="flex items-center gap-4">
                        Thanks for letting us know!
                        <div className="icon icon-smile"></div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-4">
                        Is this page useful?
                        <div className="flex items-center gap-2">
                            <div className="icon icon-like" onClick={() => giveFeedback(1)}></div>
                            <div className="icon icon-dislike" onClick={() => giveFeedback(0)}></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DocsRating;