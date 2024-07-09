import React, {useEffect, useState, useRef} from 'react';
import s from './index.module.css'
import axios from "axios";
import {useHistory} from 'react-router-dom';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface Data {
    cards: DataCard[]
    categories: DataCategory[]
    tags: DataTags[]
}

interface DataCard {
    title: string
    description: string
    tags: string[]
    url: string
}

interface DataCategory {
    title: string
    tags: string[]
}

interface DataTags {
    id: string
    description: string
}

interface Tags {
    id: string
    description: string
    color: string
}

export default function TagsNavigation(props: {tags: string}): JSX.Element {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
                return <TagsNavigationBase {...props} />
            }}
        </BrowserOnly>
    );
}

function TagsNavigationBase({tags}: { tags: string }): JSX.Element {
    const [data, setData] = useState<Data>(undefined)
    const [activeTags, setActiveTags] = useState<string[]>([])
    const [checkedTags, setCheckedTags] = useState<{ [key: string]: boolean }>({});
    const [results, setResults] = useState<DataCard[]>([])
    const checkboxesRef = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const [tagsData, setTagsData] = useState<Tags[]>([])
    const history = useHistory();

    const colors = [
        ['#d8eed6', '#dbf6da', '#a2e2ad', '#97d696', '#91e48f', '#a9d4b0', '#83b88c', '#66906D', '#79AC78', '#5c845b', '#75ba73', '#9dd598', '#7EAC7A', '#d9f2bf', '#B3C99C', '#8fa17c', '#dff9c8', '#b2d989', '#90B06E', '#6f8954', '#daf2bf', '#b4c99d', '#90A17D', '#e4f7d2', '#b9d49b', '#95ac7d', '#d2e1c1', '#ACB99E', '#e3f5e7', '#aedbb8', '#8db295', '#6D8B74', '#b7e6c3', '#96bda0', '#76957d'],
        ['#dfeefe', '#e2f3ff', '#d8eaf7', '#dbf6fb', '#C4DFDF', '#c3fbfb', '#74D8D8', '#5caeae', '#adecec', '#8EC2C2', '#709a9a', '#cbecf2', '#92C7CF', '#749fa5', '#79d7e5', '#61AEB9', '#9ADCFF', '#bee1ff', '#c8e1f2', '#7bbee3', '#6096B4', '#8bc7eb', '#c3e1fe', '#8dcbfc', '#63befc', '#cbd2e6', '#9cabd0', '#d2d9ee', '#a1b1dd', '#6f8bcb', '#d5daf0', '#A6B1E1', '#768ad1', '#c9ceec', '#9ba5dd'],
        ['#F3EEEA', '#F0EBE3', '#F1E5D1', '#eee1d4', '#EDDBC7', '#e2d6c6', '#dbcbb8', '#e5d1bb', '#d8c3b1', '#BDAE9A', '#d1b896', '#A79277', '#958979', '#c2a98b', '#d0b18a', '#a58c6c', '#D8B185', '#ac8c69', '#d2bc93', '#a89674', '#cec2ad', '#efd0c6', '#F3D7CA', '#e9a67e', '#bf8157', '#E3A081', '#f7efee', '#ede1e1', '#ead0cd', '#D5B4B4', '#DBA39A', '#e0abab', '#c28686', '#c67564', '#D59A9A']
    ]

    function findTag(id: string) {
        return tagsData.find(t => t.id === id)
    }

    const queryParams = new URLSearchParams(document.location.search)

    // Get data from JSON
    useEffect(() => {
        const rootEl = document.getElementById("__docusaurus")
        rootEl && rootEl.classList.add('docs-example-page')

        const _tags = axios.get(tags)
        _tags.then(response => {
            setData(response.data)
        })
    }, [tags]);

    // Check default checked tag
    useEffect(() => {
        if (data) {
            initializeActiveTags(data)

            data.categories.forEach((category, categoryIndex) => {
                const colorsSet = colors[categoryIndex % colors.length]

                category.tags.forEach((_tag, _tagIndex) => {
                    const tag = data.tags.find((t) => t.id === _tag)
                    if (tag) {
                        setTagsData((prevState) => ([{
                            id: tag.id,
                            description: tag.description,
                            color: colorsSet[_tagIndex % colorsSet.length]
                        }, ...prevState]))

                    }
                })
            })
        }

    }, [data, checkboxesRef.current]);

    // Set result data from active tags
    useEffect(() => {
        if (data && data.cards) {
            const _cards = []

            for (let i = 0; i < data.cards.length; i++) {
                const card = data.cards[i]

                for (let j = 0; j < activeTags.length; j++) {
                    const activeTag = activeTags[j]

                    if (card.tags.find(c => c === activeTag)) {
                        if (!_cards.find(_c => _c.title === card.title)) {
                            _cards.push(card)
                        }
                    }
                }
            }

            setResults(_cards)
        }
    }, [activeTags]);

    // Select tag
    function selectTag(e: React.ChangeEvent<HTMLInputElement>) {
        const target = e.target;

        if(activeTags.length - 1 === tagsData.length) {
            resetTags(activeTags)

            setTimeout(() => {
                if (checkboxesRef.current[target.name]) {
                    checkboxesRef.current[target.name].checked = true;
                }

                setCheckedTags((prevCheckedTags) => ({
                    ...prevCheckedTags,
                    [target.name]: target.checked
                }));

                setActiveTags((prevState) => {
                    let newTags;
                    if (target.checked) {
                        newTags = [target.name, ...prevState];
                    } else {
                        newTags = prevState.filter(a => a !== target.name);
                    }

                    // Обновление URL после изменения состояния
                    setTimeout(() => {
                        const queryParams = new URLSearchParams(window.location.search);
                        queryParams.set('tags', JSON.stringify(newTags));
                        history.push({search: queryParams.toString()});
                    }, 0);

                    return newTags;
                });
            }, 0)

            return e.preventDefault()
        }


        setCheckedTags((prevCheckedTags) => ({
            ...prevCheckedTags,
            [target.name]: target.checked
        }));

        setActiveTags((prevState) => {
            let newTags;
            if (target.checked) {
                newTags = [target.name, ...prevState];
            } else {
                newTags = prevState.filter(a => a !== target.name);
            }

            // Обновление URL после изменения состояния
            setTimeout(() => {
                if(newTags.length > tagsData.length) {
                    const queryParams = new URLSearchParams(window.location.search);
                    queryParams.delete('tags');
                    return history.push({search: queryParams.toString()});
                }

                const queryParams = new URLSearchParams(window.location.search);
                queryParams.set('tags', JSON.stringify(newTags));
                history.push({search: queryParams.toString()});
            }, 0);

            return newTags;
        });
    }


    function resetTags(tags: string[]) {
        tags.forEach(tag => {
            if (checkboxesRef.current[tag]) {
                checkboxesRef.current[tag].checked = false;
            }
        });

        setActiveTags((prevState) => {
            const newTags = prevState.filter(a => !tags.find(s => s === a));

            // Обновление URL после изменения состояния
            setTimeout(() => {
                const queryParams = new URLSearchParams(window.location.search);
                queryParams.set('tags', JSON.stringify(newTags));
                history.push({search: queryParams.toString()});
            }, 0);

            return newTags;
        });

        setCheckedTags((prevCheckedTags) => {
            const newCheckedTags = {...prevCheckedTags};
            tags.forEach(tag => {
                newCheckedTags[tag] = false;
            });
            return newCheckedTags;
        });
    }

    // Initialize active tags based on defaultChecked checkboxes
    const initializeActiveTags = (data: Data) => {
        const tagsParam = queryParams.get('tags');
        const initialTags: string[] = [];

        if (tagsParam && tagsParam.length > 2) {
            try {
                const parsedTags = JSON.parse(tagsParam);
                if (Array.isArray(parsedTags)) {
                    data.categories.forEach(category => {
                        category.tags.forEach(tag => {
                            if (checkboxesRef.current[tag]) {
                                const isTag = parsedTags.find(t => t === tag)
                                if (isTag) {
                                    initialTags.push(tag);
                                    checkboxesRef.current[tag].checked = true

                                    setCheckedTags((prevState) => {
                                        return {
                                            [tag]: true,
                                            ...prevState
                                        }
                                    });
                                } else {
                                    checkboxesRef.current[tag].checked = false
                                }
                            }
                        });
                    });
                }
            } catch (e) {
                initAll()
                console.error('Error parsing tags:', e);
            }
        } else {
            initAll()
        }

        function initAll() {
            data.categories.forEach(category => {
                category.tags.forEach(tag => {
                    if (checkboxesRef.current[tag] && checkboxesRef.current[tag].checked) {
                        initialTags.push(tag);

                        setCheckedTags((prevState) => {
                            return {
                                [tag]: true,
                                ...prevState
                            }
                        });
                    }
                });
            });
        }

        setActiveTags(initialTags);
    };

    function selectAllTags() {
        if (data) {
            const allTags = [];
            data.categories.forEach(category => {
                category.tags.forEach(tag => {
                    allTags.push(tag);
                    if (checkboxesRef.current[tag]) {
                        checkboxesRef.current[tag].checked = true;
                    }
                });
            });

            setActiveTags(allTags);
            const checkedTags = {}

            allTags.forEach((t) => {
                checkedTags[t] = true
            })

            setCheckedTags(checkedTags);

            // Обновление URL после изменения состояния
            setTimeout(() => {
                const queryParams = new URLSearchParams(window.location.search);
                queryParams.delete('tags');
                return history.push({search: queryParams.toString()});
            }, 0);
        }
    }

    const columns = [[], [], []];
    results.forEach((card, index) => {
        columns[index % 3].push(card);
    });

    return (
        <div className={s.tagsPage}>
            <div className={s.tagsCategories}>
                {(data && data.categories) && data.categories.map((category, categoryIndex) => {
                    const colorsSet = colors[categoryIndex % colors.length]
                    return <div className={s.tagsCategory} key={category.title}>
                        <span className={s.tagsCategory__title}>{category.title}</span>
                        <div className={s.tagsCategory__wrapper}>
                            <div className={s.tagsCategory__tags}>
                                {category.tags.map((tag, tagIndex) => {
                                    const _tag = findTag(tag)
                                    const isChecked = checkedTags[tag] || false;
                                    return <label className={s.tagsCategory__tag} key={tag}
                                                  style={{backgroundColor: isChecked ? colorsSet[tagIndex % colorsSet.length] : 'transparent'}}>
                                        <div className={s.tagsCategory__tooltip}
                                             dangerouslySetInnerHTML={{__html: _tag?.description}}/>
                                        <input
                                            type="checkbox"
                                            name={tag}
                                            defaultChecked={true}
                                            ref={(el) => (checkboxesRef.current[tag] = el)}
                                            onChange={selectTag}
                                        />
                                        <span><span>{tag}</span></span>
                                    </label>
                                })}
                            </div>
                            <button className={s.tagsCategory__clear} type={"button"} onClick={() => {
                                resetTags(category.tags)
                            }}>Clear
                            </button>
                        </div>
                    </div>
                })}
            </div>

            <div className={s.tagsButton}>
                {activeTags.length < tagsData.length && <button className={s.tagsCategory__clear} type={"button"} onClick={() => {
                    selectAllTags()
                }}>Select all
                </button>}
                {activeTags.length > 0 && <button className={s.tagsCategory__clear} type={"button"} onClick={() => {
                    resetTags(activeTags)
                }}>Clear all</button>}
            </div>

            <div className={s.tagsResult}>
                <span className={s.tagsResult__title}>{results.length} search results</span>
                {results.length > 0 && <div className={s.tagsResult__wrapper}>
                    <div className={s.tagsResult__scroll}>
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className={s.tagsResult__column}>
                                {column.map(card => (
                                    <div className={s.tagsResultCard} key={card.title}>
                                        <a className={s.tagsResultCard__link} href={card.url} target="_blank"></a>
                                        <div className={s.tagsResultCard__header}>
                                            <span className={s.tagsResultCard__title}>{card.title}</span>
                                            <span className={s.tagsResultCard__desc}>{card.description}</span>
                                        </div>
                                        <div className={s.tagsResultCard__tags}>
                                            {card.tags.map((tag: string) => {
                                                const _tag = findTag(tag)
                                                return <span className={s.tagsResultCard__tag} key={tag}
                                                             data-title={_tag?.description}
                                                             style={{backgroundColor: _tag?.color}}><span>{tag}</span></span>
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    );
}
