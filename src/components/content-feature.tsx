import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

export type ContentFeatureProps = PropsWithChildren<{
  image: React.ComponentType<React.ComponentProps<'svg'>>;
  links: { url: string; label: string; }[];
  className?: string;
}>

export function ContentFeature(props: ContentFeatureProps) {
  const Image = props.image;

  return (<>
    <div className={clsx('flex gap-4 px-8 py-6 rounded-lg border border-border-color-base--default bg-bg-base--indistinguishable', props.className)}>
      <Image className="w-24 h-24"/>
      <div className="flex flex-col gap-2">
        <h4 className="body--l text-fg-base--default">{props.children}</h4>
        <ul className="flex flex-col gap-2">
          {
            props.links.map((link) => {
              if (link.label === 'View more') {
                return (<li className="caption">
                  <a
                    href={link.url}
                    className="text-fg-role--active">{link.label}</a>
                </li>)
              }

              return (<li className="caption">
                <a
                  href={link.url}
                  className="text-fg-base--muted">{link.label}</a>
              </li>);
            })
          }
        </ul>
      </div>
    </div>
  </>);
}
