import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';

function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }
  return (
    <footer className="flex flex-col items-center">
      <div className="border-b border-border-color-base--default h-px w-full"/>

      <div
        className="flex flex-col pt-8 max-w-[1016px]">

        <div className="flex justify-between gap-52 pb-14">
          <div className="flex flex-col gap-20 justify-center">
            <img
              className="w-[183px]"
              src="/img/logo.svg"
              alt="Subsquid logo"/>
            <div className="flex gap-14">
              {/* @TODO: Add links */}
              <a href="">Docs</a>
              <a href="">Blog</a>
              <a href="">Community</a>
              <a href="">Ambassadors</a>
            </div>
          </div>
          <div className="flex flex-col max-w-[392px]">

            <div className="mb-10">
              <img
                src="/img/slogan.svg"
                alt="Substrate_builders program"/>
            </div>
            <div className="body--s fg-base--default mb-6">
              Substrate Builders Program
            </div>
            <div className="body--s fg-base--default">
              The Substrate Builders Program directly supports Substrate projects
              by connecting with Parity’s extensive resources, taking them to the
              next level.
            </div>
          </div>
        </div>

        <div className="border-b border-border-color-base--default h-px w-full"/>

        <div
          className="flex justify-between py-4"
        >
          <div className="body--s text-fg-base--muted w-full">Subsquid Labs GmbH</div>
          <div className="body--s text-fg-base--muted w-full max-w-[392px]">© Copyright, 2022</div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
