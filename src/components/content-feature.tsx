import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

export type ContentFeatureProps = PropsWithChildren<{
  title: string;
  path: string;
  image: string;
  className?: string;
}>

export function ContentFeature(props: ContentFeatureProps) {

  return (<>
    <a
      href={props.path}
      className={clsx(
        'flex items-center gap-4 px-8 py-6 rounded-lg border border-border-color-base--default bg-bg-base--indistinguishable',
        props.className
      )}>
      <div className="flex flex-col gap-2">
        <h4 className="body--l text-fg-base--default">{props.title}</h4>

        <p className="caption text-fg-base--muted">
          {props.children}
        </p>
      </div>
      <img
        className="w-16 h-16"
        src={props.image}
        alt={props.title}/>
    </a>
  </>);
}

export default ContentFeature;
