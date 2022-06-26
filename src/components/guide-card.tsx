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
}>

export function GuideCard(props: GuideCardProps) {
  return (
    <>
      <div className="flex flex-col rounded-lg border border-border-color-base--muted gap-2">
        <div className={clsx("rounded-t-lg h-3", `bg-${props.color}`)}/>

        <div className="flex flex-col px-6 pb-6 gap-2">
          <h5 className="body--l">{props.children}</h5>
          <p className="body--s text-fg-base--muted">{props.description}</p>
        </div>
      </div>
    </>
  );
}
