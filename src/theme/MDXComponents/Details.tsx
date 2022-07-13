import React, { useEffect, useState } from 'react';
import useCollapse from 'react-collapsed';
import clsx from 'clsx';

const ChevronDown = () => <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <path
    d="M12 13.5913L15.9424 9.29031C16.3319 8.8654 17.0018 8.8654 17.3913 9.29031V9.29031C17.7357 9.66603 17.7357 10.2427 17.3913 10.6184L12.8609 15.5608C12.398 16.0658 11.602 16.0658 11.1391 15.5608L6.60869 10.6184C6.26429 10.2427 6.26429 9.66603 6.60869 9.29031V9.29031C6.99818 8.8654 7.66806 8.8654 8.05756 9.29031L12 13.5913Z"
    fill="currentColor"/>
</svg>;


const Collapse = ({
  isActive,
  children
}) => {
  const [isExpanded, setExpanded] = useState(isActive);
  const { getCollapseProps } = useCollapse({
    isExpanded
  });

  useEffect(
    () => {
      setExpanded(isActive);
    }, [
      isActive,
      setExpanded
    ]);

  return (
    <>
      <div {...getCollapseProps()}>{children}</div>
    </>
  );
};


export default function MDXDetails(props) {
  const [isExpanded, setExpanded] = useState(false);

  const items = React.Children.toArray(props.children);
  const summary = items.find(
    (item) => React.isValidElement(item) && item.props?.mdxType === 'summary',
  );
  const children = <>{items.filter((item) => item !== summary)}</>;
  return (
    <div className={clsx('relative mb-8 border transition rounded-lg ease-linear', {
      ['border-border-color-base--default']: isExpanded,
      ['border-transparent delay-150']: !isExpanded
    })}>
      <div
        onClick={() => setExpanded(!isExpanded)}
        className={clsx(
          'flex items-center justify-between pt-4 px-2 cursor-pointer select-none flex-wrap after:content-[\'\'] after:absolute after:-left-[1px] after:-top-[1px] after:w-[calc(100%+2px)] after:h-3 after:border-t after:border-x after:border-border-color-base--default after:rounded-t-lg',
        )}
      >
        <p className={clsx('heading--4')}>{summary.props.children}</p>
        <div
          className={clsx(
            'rounded-full flex justify-center items-center bg-bg-base--subtle h-8 w-8',
            { ['-scale-[1]']: isExpanded }
          )}
        >
          <ChevronDown/>
        </div>
      </div>
      <Collapse isActive={isExpanded}>
        <div className="py-4 px-2">
          {children.props.children.map((child) => <div className="mb-2">{child}</div>)}
        </div>
      </Collapse>
    </div>
  );
}
