import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import type { PlatformOAuthClient } from "@calcom/prisma/client";
import { EmptyScreen, Button } from "@calcom/ui";

import { OAuthClientCard } from "@components/settings/platform/oauth-clients/OAuthClientCard";

type OAuthClientsListProps = {
  oauthClients: PlatformOAuthClient[];
  isDeleting: boolean;
  handleDelete: (id: string) => Promise<void>;
};

export const OAuthClientsList = ({ oauthClients, isDeleting, handleDelete }: OAuthClientsListProps) => {
const { t } = useTranslation();

  return (
    <div className="mb-10">
      <div className="border-subtle mx-auto block justify-between rounded-t-lg border px-4 py-6 sm:flex sm:px-6">
        <div className="flex w-full flex-col">
          <h1 className="font-cal text-emphasis mb-1 text-xl font-semibold leading-5 tracking-wide">{t('oauth-clients-title')}</h1>
          <p className="text-default text-sm ltr:mr-4 rtl:ml-4">{t('connect-platform-to-cal-oauth')}</p>
        </div>
        <div>
          <NewOAuthClientButton redirectLink="/settings/platform/oauth-clients/create" />
        </div>
      </div>
      {Array.isArray(oauthClients) && oauthClients.length ? (
        <>
          <div className="border-subtle rounded-b-lg border border-t-0">
            {oauthClients.map((client, index) => {
              return (
                <OAuthClientCard
                  name={client.name}
                  redirectUris={client.redirectUris}
                  bookingRedirectUri={client.bookingRedirectUri}
                  bookingRescheduleRedirectUri={client.bookingRescheduleRedirectUri}
                  bookingCancelRedirectUri={client.bookingCancelRedirectUri}
                  permissions={client.permissions}
                  key={index}
                  lastItem={oauthClients.length === index + 1}
                  id={client.id}
                  secret={client.secret}
                  isLoading={isDeleting}
                  onDelete={handleDelete}
                  areEmailsEnabled={client.areEmailsEnabled}
                  organizationId={client.organizationId}
                />
              );
            })}
          </div>
        </>
      ) : (
        <EmptyScreen
          headline="Create your first OAuth client"
          description={t('oauth-clients-access-cal-description')}
          Icon="plus"
          className=""
          buttonRaw={<NewOAuthClientButton redirectLink="/settings/platform/oauth-clients/create" />}
        />
      )}
    </div>
  );
};

const NewOAuthClientButton = ({ redirectLink, label }: { redirectLink: string; label?: string }) => {
  const router = useRouter();

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        router.push(redirectLink);
      }}
      color="secondary"
      StartIcon="plus">
      {!!label ? label : "Add"}
    </Button>
  );
};
