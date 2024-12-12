import { useTranslation, Trans } from "react-i18next";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Index() {
const { t } = useTranslation();

  const [data, setData] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const appSlug = searchParams.get("appSlug");
  const userId = searchParams.get("userId");

  useEffect(() => {
    let isRedirectNeeded = false;
    const newSearchParams = new URLSearchParams(new URL(document.URL).searchParams);
    if (!userId) {
      newSearchParams.set("userId", "1");
      isRedirectNeeded = true;
    }

    if (!appSlug) {
      newSearchParams.set("appSlug", "google-calendar");
      isRedirectNeeded = true;
    }

    if (isRedirectNeeded) {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [router, pathname, userId, appSlug]);

  async function updateToken({ invalid } = { invalid: false }) {
    const res = await fetch(
      `/api/setTokenInCalCom?invalid=${invalid ? 1 : 0}&userId=${userId}&appSlug=${appSlug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    setData(JSON.stringify(data));
  }

  return (
    <div>
      <h1>{t('welcome-to-credential-sync-playground')}</h1>
      <p><Trans
i18nKey="managing-credentials-for-cal-user-id-app-slug"
values={{ userId, appSlug }}
components={{"0": <strong />, "1": 
        <strong />}}
/>
      </p>
      <button onClick={() => updateToken({ invalid: true })}>{t('give-invalid-token-to-cal-com')}</button>
      <button onClick={() => updateToken()}>{t('give-valid-token-to-cal-com')}</button>
      <div>{data}</div>
    </div>
  );
}
