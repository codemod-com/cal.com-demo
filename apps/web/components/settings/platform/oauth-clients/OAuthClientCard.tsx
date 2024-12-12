import { useTranslation, Trans } from "react-i18next";
import { useRouter } from "next/navigation";
import React from "react";

import { classNames } from "@calcom/lib";
import { PERMISSIONS_GROUPED_MAP } from "@calcom/platform-constants";
import type { Avatar } from "@calcom/prisma/client";
import { Button, Icon, showToast } from "@calcom/ui";

import { hasPermission } from "../../../../../../packages/platform/utils/permissions";

type OAuthClientCardProps = {
  name: string;
  logo?: Avatar;
  redirectUris: string[];
  bookingRedirectUri: string | null;
  bookingCancelRedirectUri: string | null;
  bookingRescheduleRedirectUri: string | null;
  areEmailsEnabled: boolean;
  permissions: number;
  lastItem: boolean;
  id: string;
  secret: string;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  organizationId: number;
};

export const OAuthClientCard = ({
  name,
  logo,
  redirectUris,
  bookingRedirectUri,
  bookingCancelRedirectUri,
  bookingRescheduleRedirectUri,
  permissions,
  id,
  secret,
  lastItem,
  onDelete,
  isLoading,
  areEmailsEnabled,
  organizationId,
}: OAuthClientCardProps) => {
const { t } = useTranslation();

  const router = useRouter();

  const clientPermissions = Object.values(PERMISSIONS_GROUPED_MAP).map((value, index) => {
    let permissionsMessage = "";
    const hasReadPermission = hasPermission(permissions, value.read);
    const hasWritePermission = hasPermission(permissions, value.write);

    if (hasReadPermission || hasWritePermission) {
      permissionsMessage = hasReadPermission ? "read" : "write";
    }

    if (hasReadPermission && hasWritePermission) {
      permissionsMessage = "read/write";
    }

    return (
      !!permissionsMessage && (
        <div key={value.read} className="relative text-sm">
          &nbsp;{permissionsMessage} {`${value.label}s`.toLocaleLowerCase()}
          {Object.values(PERMISSIONS_GROUPED_MAP).length === index + 1 ? " " : ", "}
        </div>
      )
    );
  });

  return (
    <div
      className={classNames(
        "flex w-full justify-between px-4 py-4 sm:px-6",
        lastItem ? "" : "border-subtle border-b"
      )}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <p className="font-semibold"><Trans
i18nKey="client-name-span"
values={{ _name_: <>{name}</> }}
components={{"0": <span className="font-normal" />}}
/>
          </p>
        </div>
        {!!logo && (
          <div>
            <>{logo}</>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="font-semibold">{t('client-id')}</div>
            <div>{id}</div>
            <Icon
              name="clipboard"
              type="button"
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(id);
                showToast("Client id copied to clipboard.", "success");
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-semibold">{t('client-secret')}</div>
          <div className="flex items-center justify-center rounded-md">
            {[...new Array(20)].map((_, index) => (
              <Icon name="asterisk" key={`${index}asterisk`} className="h-2 w-2" />
            ))}
            <Icon
              name="clipboard"
              type="button"
              className="ml-2 h-4 w-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(secret);
                showToast("Client secret copied to clipboard.", "success");
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="font-semibold">{t('organization-id')}</div>
            <div>{organizationId}</div>
            <Icon
              name="clipboard"
              type="button"
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(organizationId.toString());
                showToast("Organization id copied to clipboard.", "success");
              }}
            />
          </div>
        </div>
        <div className="border-subtle flex text-sm">
          <span className="font-semibold">{t('permissions')}</span>
          {permissions ? <div className="flex">{clientPermissions}</div> : <>{t('disabled')}</>}
        </div>
        <div className="flex gap-1 text-sm">
          <span className="font-semibold">{t('redirect-uris')}</span>
          {redirectUris.map((item, index) => (redirectUris.length === index + 1 ? `${item}` : `${item}, `))}
        </div>
        {bookingRedirectUri && (
          <div className="flex gap-1 text-sm">
            <span className="font-semibold">{t('booking-redirect-uri')}</span> {bookingRedirectUri}
          </div>
        )}
        {bookingRescheduleRedirectUri && (
          <div className="flex gap-1 text-sm">
            <span className="font-semibold">{t('booking-reschedule-uri')}</span> {bookingRescheduleRedirectUri}
          </div>
        )}
        {bookingCancelRedirectUri && (
          <div className="flex gap-1 text-sm">
            <span className="font-semibold">{t('booking-cancel-uri')}</span> {bookingCancelRedirectUri}
          </div>
        )}
        <div className="flex gap-1 text-sm">
          <span className="text-sm font-semibold">{t('emails-enabled')}</span> {areEmailsEnabled ? "Yes" : "No"}
        </div>
      </div>
      <div className="flex items-start gap-4">
        <Button
          color="primary"
          loading={isLoading}
          disabled={isLoading}
          onClick={() => router.push(`/settings/platform/oauth-clients/${id}/edit/webhooks`)}>{t('webhooks')}</Button>
        <Button
          color="secondary"
          loading={isLoading}
          disabled={isLoading}
          onClick={() => router.push(`/settings/platform/oauth-clients/${id}/edit`)}>{t('edit')}</Button>
        <Button color="destructive" loading={isLoading} disabled={isLoading} onClick={() => onDelete(id)}>{t('delete')}</Button>
      </div>
    </div>
  );
};
