import { useTranslation, Trans } from "react-i18next";
import type { TFunction } from "next-i18next";
import { Trans } from "next-i18next";

import { APP_NAME, WEBAPP_URL, IS_PRODUCTION } from "@calcom/lib/constants";

import { getSubject, getTypeOfInvite } from "../../templates/team-invite-email";
import { V2BaseEmailHtml, CallToAction } from "../components";

type TeamInvite = {
  language: TFunction;
  from: string;
  to: string;
  teamName: string;
  joinLink: string;
  isCalcomMember: boolean;
  isAutoJoin: boolean;
  isOrg: boolean;
  parentTeamName: string | undefined;
  isExistingUserMovedToOrg: boolean;
  prevLink: string | null;
  newLink: string | null;
};

export const TeamInviteEmail = (
  props: TeamInvite & Partial<React.ComponentProps<typeof V2BaseEmailHtml>>
) => {
const { t } = useTranslation("../templates");

  const typeOfInvite = getTypeOfInvite(props);

  const heading = getHeading();
  const content = getContent();
  return (
    <V2BaseEmailHtml subject={getSubject(props)}>
      <p style={{ fontSize: "24px", marginBottom: "16px", textAlign: "center" }}>
        <>{heading}</>
      </p>
      <img
        style={{
          borderRadius: "16px",
          height: "270px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        src={
          IS_PRODUCTION
            ? `${WEBAPP_URL}/emails/calendar-email-hero.png`
            : "http://localhost:3000/emails/calendar-email-hero.png"
        }
        alt={t('empty-string')}
      />
      <p
        style={{
          fontWeight: 400,
          lineHeight: "24px",
          marginBottom: "32px",
          marginTop: "32px",
          lineHeightStep: "24px",
        }}>
        <>{content}</>
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CallToAction
          label={props.language(
            props.isCalcomMember ? (props.isAutoJoin ? "login" : "email_user_cta") : "create_your_account"
          )}
          href={props.joinLink}
          endIconName="linkIcon"
        />
      </div>
      <p
        style={{
          fontWeight: 400,
          lineHeight: "24px",
          marginBottom: "32px",
          marginTop: "48px",
          lineHeightStep: "24px",
        }}
      />

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

  function getHeading() {
    const autoJoinType = props.isAutoJoin ? "added" : "invited";
    const variables = {
      appName: APP_NAME,
      parentTeamName: props.parentTeamName,
    };

    if (typeOfInvite === "TO_ORG") {
      return props.language(`email_team_invite|heading|${autoJoinType}_to_org`, variables);
    }

    if (typeOfInvite === "TO_SUBTEAM") {
      return props.language(`email_team_invite|heading|${autoJoinType}_to_subteam`, variables);
    }

    return props.language(`email_team_invite|heading|invited_to_regular_team`, variables);
  }

  function getContent() {
    const autoJoinType = props.isAutoJoin ? "added" : "invited";

    const variables = {
      invitedBy: props.from.toString(),
      appName: APP_NAME,
      teamName: props.teamName,
      parentTeamName: props.parentTeamName,
      prevLink: props.prevLink,
      newLink: props.newLink,
      orgName: props.parentTeamName ?? props.isOrg ? props.teamName : "",
      prevLinkWithoutProtocol: props.prevLink?.replace(/https?:\/\//, ""),
      newLinkWithoutProtocol: props.newLink?.replace(/https?:\/\//, ""),
    };

    const {
      prevLink,
      newLink,
      teamName,
      invitedBy,
      appName,
      parentTeamName,
      prevLinkWithoutProtocol,
      newLinkWithoutProtocol,
    } = variables;
    if (typeOfInvite === "TO_ORG") {
      if (props.isExistingUserMovedToOrg) {
        return (
          <>
            {autoJoinType == "added" ? (
              <>
                <Trans i18nKey="email_team_invite|content|added_to_org"><Trans
i18nKey="invited-by-added-to-team-organization"
values={{ invitedBy, _teamName_: <>{teamName}</> }}
components={{"0": <strong />}}
/></Trans>{" "}
                <Trans
                  i18nKey="email_team_invite|content_addition|existing_user_added"
                  values={{ prevLink: props.prevLink, newLink: props.newLink, teamName: props.teamName }}><Trans
i18nKey="link-changed-from-to"
values={{ _prevLinkWithoutProtocol_: <>{prevLinkWithoutProtocol}</>, _newLinkWithoutProtocol_: <>{newLinkWithoutProtocol}</> }}
components={{"0": <a href={prevLink ?? ""} />, "1": 
                  <a href={newLink ?? ""} />}}
/><br />
                  <br /><Trans
i18nKey="personal-event-types-moved-to-organization"
values={{ _teamName_: <>{teamName}</> }}
components={{"0": 
                  <strong />}}
/><br />
                  <br />{t('log-in-check-private-events')}<br />
                  <br />{t('recommend-creating-new-account')}<br />
                  <br /><Trans
i18nKey="enjoy-new-clean-link"
values={{ _newLinkWithoutProtocol_: <>{newLinkWithoutProtocol}</> }}
components={{"0": 
                  <a href={`${newLink}?orgRedirection=true`} />}}
/>
                </Trans>
              </>
            ) : (
              <>
                <Trans i18nKey="email_team_invite|content|invited_to_org"><Trans
i18nKey="invited-by-invited-to-join-organization"
values={{ invitedBy, _teamName_: <>{teamName}</> }}
components={{"0": <strong />}}
/></Trans>{" "}
                <Trans
                  i18nKey="existing_user_added_link_will_change"
                  values={{ prevLink: props.prevLink, newLink: props.newLink, teamName: props.teamName }}>{t('link-change-on-accepting-invite')}<br />
                  <br /><Trans
i18nKey="personal-event-types-moved-to-organization-duplicate"
values={{ _teamName_: <>{teamName}</> }}
components={{"0": 
                  <strong />}}
/><br />
                  <br />{t('recommend-creating-new-account-duplicate')}</Trans>
              </>
            )}
          </>
        );
      }
      return (
        <>
          {autoJoinType === "added" ? (
            <Trans i18nKey="email_team_invite|content|added_to_org"><Trans
i18nKey="invited-by-added-to-team-organization-duplicate"
values={{ invitedBy, _teamName_: <>{teamName}</> }}
components={{"0": <strong />}}
/></Trans>
          ) : (
            <Trans i18nKey="email_team_invite|content|invited_to_org"><Trans
i18nKey="invited-by-invited-to-join-organization-duplicate"
values={{ invitedBy, _teamName_: <>{teamName}</> }}
components={{"0": <strong />}}
/></Trans>
          )}{" "}
          <Trans>{t('app-name-event-juggling-scheduler', { appName })}</Trans>
        </>
      );
    }

    if (typeOfInvite === "TO_SUBTEAM") {
      return (
        <>
          {autoJoinType === "added" ? (
            <Trans i18nKey="email_team_invite|content|added_to_subteam"><Trans
i18nKey="invited-by-added-to-team-in-organization"
values={{ invitedBy, _teamName_: <>{teamName}</>, _parentTeamName_: <>{parentTeamName}</> }}
components={{"0": <strong />, "1": 
              <strong />}}
/></Trans>
          ) : (
            <Trans i18nKey="email_team_invite|content|invited_to_subteam"><Trans
i18nKey="invited-by-invited-to-team-in-organization"
values={{ invitedBy, _teamName_: <>{teamName}</>, _parentTeamName_: <>{parentTeamName}</> }}
components={{"0": <strong />, "1": 
              <strong />}}
/></Trans>
          )}{" "}
          <Trans>{t('app-name-event-juggling-scheduler-duplicate', { appName })}</Trans>
        </>
      );
    }
    // Regular team doesn't support auto-join. So, they have to be invited always
    return props.language(`email_team_invite|content|invited_to_regular_team`, variables);
  }
};
