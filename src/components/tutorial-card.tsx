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
            'tutorial-card relative flex flex-col rounded-lg bg-bg-base--subtle gap-2 p-6 cursor-pointer transition duration-150 ease-out',
            {
              'hover:border-border-color-base--default hover:shadow-[0_0_12px_rgba(67,67,67,0.3)]': !props.disabled
            }
          )
        }
        href={props.path ?? null}>
        <h5
          className={clsx('body--m', {
            'text-fg-base--default': !props.disabled,
            'text-fg-base--muted': props.disabled,
          })}>{props.children}</h5>
        <p className="body--s text-fg-base--muted mb-4 font-light">{props.description}</p>
        <button className="x-button x-button--small tutorial-card__btn">Migrate</button>
      </a>
    </>
  );
}
