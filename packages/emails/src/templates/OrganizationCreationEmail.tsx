import { useTranslation, Trans } from "react-i18next";
import { Trans } from "next-i18next";

import { APP_NAME, WEBAPP_URL } from "@calcom/lib/constants";

import type { OrganizationCreation } from "../../templates/organization-creation-email";
import { V2BaseEmailHtml } from "../components";

export const OrganizationCreationEmail = (
  props: OrganizationCreation & Partial<React.ComponentProps<typeof V2BaseEmailHtml>>
) => {
const { t } = useTranslation();

  const { prevLink, newLink, orgName: teamName } = props;
  const prevLinkWithoutProtocol = props.prevLink?.replace(/https?:\/\//, "");
  const newLinkWithoutProtocol = props.newLink?.replace(/https?:\/\//, "");
  const isNewUser = props.ownerOldUsername === null;
  return (
    <V2BaseEmailHtml subject={props.language(`email_organization_created|subject`)}>
      <p style={{ fontSize: "24px", marginBottom: "16px", textAlign: "center" }}>
        <>{props.language(`You have created ${props.orgName} organization.`)}</>
      </p>
      <img
        style={{
          borderRadius: "16px",
          height: "270px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        src={`${WEBAPP_URL}/emails/calendar-email-hero.png`}
        alt={t('empty-string')}
      />
      <p
        style={{
          fontWeight: 400,
          lineHeight: "24px",
          marginBottom: "32px",
          marginTop: "32px",
          lineHeightStep: "24px",
        }}><Trans
i18nKey="added-owner-organization"
values={{ WEBAPP_URL }}
components={{"0": 
        <a href={`${WEBAPP_URL}/upgrade`} />}}
/>
      </p>
      <p
        data-testid="organization-link-info"
        style={{
          fontWeight: 400,
          lineHeight: "24px",
          marginBottom: "32px",
          marginTop: "48px",
          lineHeightStep: "24px",
        }}>
        {isNewUser ? (
          <Trans><Trans
i18nKey="new-organization-link"
values={{ _newLinkWithoutProtocol_: <>{newLinkWithoutProtocol}</> }}
components={{"0": <a href={`${newLink}`} />}}
/>
          </Trans>
        ) : (
          <Trans i18nKey="email|existing_user_added_link_changed"><Trans
i18nKey="link-changed-notification"
values={{ _prevLinkWithoutProtocol_: <>{prevLinkWithoutProtocol}</>, _newLinkWithoutProtocol_: <>{newLinkWithoutProtocol}</> }}
components={{"0": <a href={prevLink ?? ""} />, "1": 
            <a href={newLink ?? ""} />}}
/><br />
            <br /><Trans
i18nKey="personal-event-types-moved"
values={{ _teamName_: <>
              {teamName}</> }}
components={{"0": <strong />}}
/><br />
            <br />{t('check-private-events')}<br />
            <br />{t('recommend-new-account')}<br />
            <br /><Trans
i18nKey="new-clean-link"
values={{ _newLinkWithoutProtocol_: <>{newLinkWithoutProtocol}</> }}
components={{"0": <a href={`${newLink}?orgRedirection=true`} />}}
/>
          </Trans>
        )}
      </p>

      <div className="">
        <p
          style={{
            fontWeight: 400,
            lineHeight: "24px",
            marginBottom: "32px",
            marginTop: "32px",
            lineHeightStep: "24px",
          }}>
          <>
            {props.language("email_no_user_signoff", {
              appName: APP_NAME,
            })}
          </>
        </p>
      </div>

      <div style={{ borderTop: "1px solid #E1E1E1", marginTop: "32px", paddingTop: "32px" }}>
        <p style={{ fontWeight: 400, margin: 0 }}>
          <>
            {props.language("have_any_questions")}{" "}
            <a href="mailto:support@cal.com" style={{ color: "#3E3E3E" }} target="_blank" rel="noreferrer">
              <>{props.language("contact")}</>
            </a>{" "}
            {props.language("our_support_team")}
          </>
        </p>
      </div>
    </V2BaseEmailHtml>
  );
};
