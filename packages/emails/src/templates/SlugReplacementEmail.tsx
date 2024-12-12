"use client";
import { useTranslation, Trans } from "react-i18next";


import type { TFunction } from "next-i18next";
import { Trans } from "next-i18next";

import { WEBAPP_URL } from "@calcom/lib/constants";

import { BaseEmailHtml, CallToAction } from "../components";

export const SlugReplacementEmail = (
  props: {
    slug: string;
    name: string;
    teamName: string;
    t: TFunction;
  } & Partial<React.ComponentProps<typeof BaseEmailHtml>>
) => {
const { t } = useTranslation();

  const { slug, name, teamName, t } = props;

  return (
    <BaseEmailHtml
      subject={t("email_subject_slug_replacement", { slug: slug })}
      headerType="teamCircle"
      title={t("event_replaced_notice")}>
      <>
        <Trans i18nKey="hi_user_name" name={name}>
          <p style={{ fontWeight: 400, lineHeight: "24px", display: "inline-block" }}>{t('hi-{name}', { name })}</p>
          <p style={{ display: "inline" }}>,</p>
        </Trans>
        <Trans i18nKey="email_body_slug_replacement_notice" slug={slug}>
          <p style={{ fontWeight: 400, lineHeight: "24px" }}><Trans
i18nKey="administrator-on-{team-name}-replaced-event-type-{slug}"
values={{ _teamName_: <>{teamName}</>, slug }}
components={{"0": <strong />, "1": 
            <strong />}}
/></p>
        </Trans>
        <Trans i18nKey="email_body_slug_replacement_info">
          <p style={{ fontWeight: 400, lineHeight: "24px" }}>{t('link-continues-to-work-settings-may-have-changed')}</p>
        </Trans>
        <table
          role="presentation"
          border={0}
          style={{ verticalAlign: "top", marginTop: "25px" }}
          width="100%">
          <tbody>
            <tr>
              <td align="center">
                <CallToAction
                  label={t("review_event_type")}
                  href={`${WEBAPP_URL}/event-types`}
                  endIconName="white-arrow-right"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <p
          style={{
            borderTop: "solid 1px #E1E1E1",
            fontSize: 1,
            margin: "35px auto",
            width: "100%",
          }}
        />
        <Trans i18nKey="email_body_slug_replacement_suggestion">
          <p style={{ fontWeight: 400, lineHeight: "24px" }}>{t('questions-about-event-type-reach-out-to-administrator')}<br />
            <br />{t('happy-scheduling')}<br />{t('the-cal-com-team')}</p>
        </Trans>
        {/*<p style={{ fontWeight: 400, lineHeight: "24px" }}>
          <>{t("email_body_slug_replacement_suggestion")}</>
        </p>*/}
      </>
    </BaseEmailHtml>
  );
};
