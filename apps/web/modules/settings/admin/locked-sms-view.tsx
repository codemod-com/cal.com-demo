"use client";
import { useTranslation } from "react-i18next";


import { useState } from "react";

import { trpc } from "@calcom/trpc";
import { Button, TextField, showToast } from "@calcom/ui";

import UsersTable from "./components/UsersTable";

export default function LockedSMSView() {
const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [teamSlug, setTeamSlug] = useState("");

  const utils = trpc.useContext();

  const mutation = trpc.viewer.admin.setSMSLockState.useMutation({
    onSuccess: (data) => {
      if (data) {
        showToast(`${data.name} successfully ${data.locked ? "locked" : "unlocked"}`, "success");
      }
      utils.viewer.admin.getSMSLockStateTeamsUsers.invalidate();
    },
    onError: (error) => {
      showToast(`${error}`, "error");
      utils.viewer.admin.getSMSLockStateTeamsUsers.invalidate();
    },
  });

  function setSMSLockState({ userId, teamId, lock }: { userId?: number; teamId?: number; lock: boolean }) {
    mutation.mutate({
      userId,
      teamId,
      lock,
    });
  }

  return (
    <div>
      <div className="mb-4 flex w-full items-center justify-between space-x-2 rtl:space-x-reverse">
        <div className="flex">
          <TextField
            name="Lock User"
            placeholder={t('username-key')}
            defaultValue=""
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
          <Button
            type="submit"
            className="ml-2 mt-5"
            onClick={() => {
              mutation.mutate({ username, lock: true });
              utils.viewer.admin.getSMSLockStateTeamsUsers.invalidate();
            }}>{t('lock-user-key')}</Button>
        </div>
        <div className="flex">
          <TextField
            name="Lock Team"
            placeholder={t('team-slug-key')}
            defaultValue=""
            onChange={(event) => {
              setTeamSlug(event.target.value);
            }}
            value={teamSlug}
          />
          <Button
            type="submit"
            className="ml-2 mt-5"
            onClick={() => {
              mutation.mutate({ teamSlug, lock: true });
              utils.viewer.admin.getSMSLockStateTeamsUsers.invalidate();
            }}>{t('lock-team-key')}</Button>
        </div>
      </div>
      <UsersTable setSMSLockState={setSMSLockState} />
    </div>
  );
}
