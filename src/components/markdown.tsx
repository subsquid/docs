import React from 'react';
import {MDXProvider} from '@mdx-js/react'

export const Markdown = (props) => {

  console.log('props.children: ', props.children.props.children.props.children);

  // return <MDXProvider components={{
  //   code: (props) => {
  //     console.log('props: ', props);
  //     return <code>{props.children}</code>;
  //   }
  // }}>{props.children.props.children.props.children}</MDXProvider>;
};
