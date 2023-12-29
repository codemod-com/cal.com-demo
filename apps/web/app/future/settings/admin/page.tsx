import LegacyPage from "@pages/settings/admin/index";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import { getLayout } from "@components/auth/layouts/AdminLayoutAppDir";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Admin",
    () => "admin_description"
  );

<<<<<<< HEAD
export default WithLayout({ getLayout, Page: LegacyPage });
=======
export default async function Page() {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper getLayout={getLayout} requiresLicense={false} nonce={nonce} themeBasis={null}>
      <LegacyPage />
    </PageWrapper>
  );
}
>>>>>>> e2795b137 (remove-route-groups)
