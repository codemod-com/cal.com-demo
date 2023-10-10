import EventTypePage from "@pages/event-types/[type]/index";
import { headers } from "next/headers";

import PageWrapper from "@components/PageWrapperAppDir";

const EventType = async () => {
  const h = headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <PageWrapper requiresLicense={false} nonce={nonce} themeBasis={null}>
      <EventTypePage />
    </PageWrapper>
  );
};

export default EventType;
