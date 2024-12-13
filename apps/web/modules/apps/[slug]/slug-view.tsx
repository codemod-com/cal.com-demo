"use client";
import { useTranslation, Trans } from "react-i18next";


import MarkdownIt from "markdown-it";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";

import { IS_PRODUCTION } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import { showToast } from "@calcom/ui";

import type { getStaticProps } from "@lib/apps/[slug]/getStaticProps";
import useRouterQuery from "@lib/hooks/useRouterQuery";

import App from "@components/apps/App";

const md = new MarkdownIt("default", { html: true, breaks: true });

export type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

function SingleAppPage(props: PageProps) {
const { t } = useTranslation("../../../tmp/i6o6wu/apps/web/modules/apps/[slug]");

  const { error, setQuery: setError } = useRouterQuery("error");
  const { t } = useLocale();
  if (error === "account_already_linked") {
    showToast(t(error), "error", { id: error });
    setError(undefined);
  }
  // If it's not production environment, it would be a better idea to inform that the App is disabled.
  if (props.isAppDisabled) {
    if (!IS_PRODUCTION) {
      // TODO: Improve disabled App UI. This is just a placeholder.
      return (
        <div className="p-2"><Trans
i18nKey="this-app-seems-to-be-disabled-if-you-are-an-admin-you-can-enable-this-app-from-here"
components={{"0": 
          <Link href="/settings/admin/apps" className="cursor-pointer text-blue-500 underline" />}}
/>
        </div>
      );
    }

    // Disabled App should give 404 any ways in production.
    return null;
  }

  const { source, data } = props;
  return (
    <App
      name={data.name}
      description={data.description}
      isGlobal={data.isGlobal}
      slug={data.slug}
      variant={data.variant}
      type={data.type}
      logo={data.logo}
      categories={data.categories ?? [data.category]}
      author={data.publisher}
      feeType={data.feeType || "usage-based"}
      price={data.price || 0}
      commission={data.commission || 0}
      docs={data.docsUrl}
      website={data.url}
      email={data.email}
      licenseRequired={data.licenseRequired}
      teamsPlanRequired={data.teamsPlanRequired}
      descriptionItems={source.data?.items as string[] | undefined}
      isTemplate={data.isTemplate}
      dependencies={data.dependencies}
      concurrentMeetings={data.concurrentMeetings}
      paid={data.paid}
      //   tos="https://zoom.us/terms"
      //   privacy="https://zoom.us/privacy"
      body={
        <>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: markdownToSafeHTML(source.content) }} />
        </>
      }
    />
  );
}

export default SingleAppPage;
