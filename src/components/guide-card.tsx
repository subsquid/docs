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
  isExternalLink?: boolean;
}>

export function GuideCard(props: GuideCardProps) {
  return (
    <>
      <a href={props.path ?? null}
         {...(props.isExternalLink ? {target: '_blank'} : {})}
         className={
           clsx(
               'flex flex-col rounded-lg gap-2 cursor-pointer transition duration-150 ease-out p-4 quide-card',
               {
                 'hover:border-border-color-base--default hover:shadow-[0_0_4px_rgba(67,65,65,0.15)]': true
               }
           )
         }
      >
        <div className="flex flex-col gap-2">
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
