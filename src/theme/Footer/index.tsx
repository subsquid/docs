import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import SubsquidLogo from '/static/img/logo.svg';
import SubsquidBuildersProgram from '/static/img/slogan.svg';

function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }
  return (
    <footer className="flex flex-col items-center">
      <div className="border-b border-border-color-base--default h-px w-full"/>

      <div
        className="flex flex-col pt-8 max-w-[1128px] xl:max-w-[1280px] xl:max-w-[1360px] wide:max-w-[1480px] w-full">

        <div className="flex flex-col justify-between gap-14 pb-14 px-6">
          <div className="flex flex-col gap-12">
            <SubsquidLogo
              className="w-[183px]"
              height={60}/>
            <div className="flex gap-14">

              <div className="body--s fg-base--default">
                <a
                  href="https://docs.subsquid.io/"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  Docs
                </a>
              </div>
              <div className="body--s fg-base--default">
                <a
                  href="https://subsquid.medium.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  Blog
                </a>
              </div>
              <div className="body--s fg-base--default">
                <a
                  href="https://subsquid.io/ambassador"
                  target="_blank"
                  rel="noreferrer"
                  className="link">
                  Ambassadors
                </a>
              </div>

            </div>
          </div>
          <div className="flex flex-col max-w-[392px]">

            <div className="mb-10">
              <SubsquidBuildersProgram/>
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
          className="flex justify-between py-4 px-6"
        >
          <div className="body--s text-fg-base--muted w-full">Subsquid Labs GmbH</div>
          <div className="body--s text-fg-base--muted w-full max-w-[392px]">© Copyright, 2022</div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
