import React from 'react';
import clsx from 'clsx';

type BgColor =
  | 'bg-role--building'
  | 'bg-role--success'
  | 'bg-role--error'
  | 'bg-role--syncing'
  | 'bg-role--info'
  | 'bg-role--notice'
  | 'bg-role--warning';

export type GuideCardProps = React.PropsWithChildren<{
  description: string;
  color: BgColor;
  path?: string;
  isDisabled?: boolean;
}>

export function GuideCard(props: GuideCardProps) {
  return (
    <>
      <a className="flex flex-col rounded-lg gap-2" href={props.path ?? null}>
        <div className="flex flex-col pb-6 gap-2">
          <h5 className={clsx("body--m", {
            'text-fg-base--default': !props.isDisabled,
            'text-fg-base--muted': props.isDisabled
          })}>{props.children}</h5>
          <p className="body--s text-fg-base--muted font-light">{props.description}</p>
        </div>
      </a>
    </>
  );
}

export default GuideCard;
