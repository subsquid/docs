import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents'

type CodeStepProps = React.PropsWithChildren<{
  number: number;
  description: string | undefined;
}>

export const CodeStep: React.FunctionComponent = (props: CodeStepProps) => {
  // @ts-ignore
  const markdownValue = props.children.props?.originalType === 'pre' ? props.children.props.children.props.children : props.children;
  // console.log('markdownValue: ', markdownValue);
  // console.log('props.children.props.children.props.children: ', props.children.props.children.props.children);
  return (<div className="flex gap-4 body--s mb-2 codestep">
    <div className="w-8 h-8 rounded-full bg-bg-base--subtle flex font-medium text-fg-base--default">
      <span className="block m-auto">{props.number}</span></div>
    <div className="text-fg-base--default flex flex-col gap-2 pt-1">
      {props.children}

      {/*{props.description && <span className="caption">{props.description}</span>}*/}
    </div>
  </div>);
};
