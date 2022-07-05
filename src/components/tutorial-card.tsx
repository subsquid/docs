import React from 'react';

export type TutorialCard = React.PropsWithChildren<{
  description: string;
  path: string;
}>

export function TutorialCard(props: TutorialCard) {
  return (
    <>
      <a className="flex flex-col rounded-lg border border-border-color-base--muted bg-bg-base--subtle gap-2 p-6 cursor-pointer hover:bg-bg-base--default hover:border-border-color-base--default transition duration-150 ease-out" href={props.path}>
        <h5 className="body--l text-fg-base--default">{props.children}</h5>
        <p className="body--s text-fg-base--muted">{props.description}</p>
      </a>
    </>
  );
}
