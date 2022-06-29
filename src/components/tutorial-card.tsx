import React from 'react';

export type TutorialCard = React.PropsWithChildren<{
  description: string;
}>

export function TutorialCard(props: TutorialCard) {
  return (
    <>
      <div className="flex flex-col rounded-lg border border-border-color-base--muted bg-bg-base--subtle gap-2 p-6">
        <h5 className="body--l text-fg-base--default">{props.children}</h5>
        <p className="body--s text-fg-base--muted">{props.description}</p>
      </div>
    </>
  );
}
