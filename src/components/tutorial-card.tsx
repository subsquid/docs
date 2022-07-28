import React from 'react';
import clsx from 'clsx';

import LaunchIcon from '/static/img/rocket_launch.svg'

export type TutorialCard = React.PropsWithChildren<{
  description: string;
  path?: string;
  disabled?: boolean;
}>

export function TutorialCard(props: TutorialCard) {
  return (
    <>
      <a
        className={
          clsx(
            'relative flex flex-col rounded-lg border border-border-color-base--muted bg-bg-base--subtle gap-2 p-6 cursor-pointer transition duration-150 ease-out',
            {
              'hover:bg-bg-base--default hover:border-border-color-base--default': !props.disabled
            }
          )
        }
        href={props.path ?? null}>
        <LaunchIcon className="text-fg-base--muted absolute top-2 right-2" />
        <h5
          className={clsx('body--l', {
            'text-fg-base--default': !props.disabled,
            'text-fg-base--muted': props.disabled,
          })}>{props.children}</h5>
        <p className="body--s text-fg-base--muted">{props.description}</p>
      </a>
    </>
  );
}
