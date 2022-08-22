import React, { PropsWithChildren, useState } from 'react';
import { Expand } from '@site/src/components/Expand/Expand';
import clsx from 'clsx';

type ExpandContentProps = PropsWithChildren & {
  title: string;
}

export function ExpandContent(props: ExpandContentProps) {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <div
      className={clsx('relative mb-8 border transition rounded-lg ease-linear', {
        ['border-border-color-base--default']: isExpanded,
        ['border-transparent delay-150']: !isExpanded
      })}>
      <Expand
        onClick={() => setExpanded(!isExpanded)}
        title={<h4 className="body--m lg:body--l text-fg-base--default">{props.title}</h4>}
        expanded={isExpanded}
        children={props.children}
        element={(child, key) => <div className="mb-2" key={key}>{child}</div>}/>
    </div>
  );
}

export default ExpandContent;
