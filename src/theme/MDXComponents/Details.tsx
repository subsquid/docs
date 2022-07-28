import React, { useEffect, useState } from 'react';
import useCollapse from 'react-collapsed';
import clsx from 'clsx';
import { Expand } from '@site/src/components/Expand/Expand';

export default function MDXDetails(props) {
  const [isExpanded, setExpanded] = useState(false);

  const items = React.Children.toArray(props.children);
  const summary = items.find(
    (item) => React.isValidElement(item) && item.props?.mdxType === 'summary',
  );
  const children = <>{items.filter((item) => item !== summary)}</>;
  return (
    <div
      className={clsx('relative mb-8 border transition rounded-lg ease-linear', {
        ['border-border-color-base--default']: isExpanded,
        ['border-transparent delay-150']: !isExpanded
      })}>
      <Expand
        onClick={() => setExpanded(!isExpanded)}
        title={<p className="body--m">{summary.props.children}</p>}
        expanded={isExpanded}
        children={children}
        element={(child) => <div className="mb-2">{child}</div>}/>
    </div>
  );
}
