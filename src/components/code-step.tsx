import React from 'react';

type CodeStepProps = React.PropsWithChildren<{
  number: number;
  description: string | undefined;
}>

export const CodeStep: React.FunctionComponent = (props: CodeStepProps) => {
  return (<div className="flex gap-4 body--s mb-2 codestep">
    <div className="w-8 h-8 rounded-full bg-bg-base--subtle flex font-medium text-fg-base--default">
      <span className="block m-auto">{props.number}</span></div>
    <div className="text-fg-base--default flex flex-col gap-2 pt-1">
      {props.children}
    </div>
  </div>);
};
