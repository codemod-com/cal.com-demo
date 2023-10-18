import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { cookies, headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { URLSearchParams } from "url";
import { z } from "zod";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { getDefaultEvent } from "@calcom/lib/defaultEvents";
import { maybeGetBookingUidFromSeat } from "@calcom/lib/server/maybeGetBookingUidFromSeat";
import prisma, { bookingMinimalSelect } from "@calcom/prisma";

type PageProps = Readonly<{
  params: Params;
}>;

export default async function Page({ params }: PageProps) {
  await getProps(params);

  return null;
}

async function getProps(params: Params) {
  const req = { headers: headers(), cookies: cookies() };
  const session = await getServerSession({ req });

  const { uid: bookingUid, seatReferenceUid } = z
    .object({ uid: z.string(), seatReferenceUid: z.string().optional() })
    .parse(params);

  const { uid, seatReferenceUid: maybeSeatReferenceUid } = await maybeGetBookingUidFromSeat(
    prisma,
    bookingUid
  );
  const booking = await prisma.booking.findUnique({
    where: {
      uid,
    },
    select: {
      ...bookingMinimalSelect,
      eventType: {
        select: {
          users: {
            select: {
              username: true,
            },
          },
          slug: true,
          team: {
            select: {
              slug: true,
            },
          },
          seatsPerTimeSlot: true,
          userId: true,
          owner: {
            select: {
              id: true,
            },
          },
          hosts: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      dynamicEventSlugRef: true,
      dynamicGroupSlugRef: true,
      user: true,
    },
  });
  const dynamicEventSlugRef = booking?.dynamicEventSlugRef || "";

  if (!booking) {
    return notFound();
  }

  if (!booking?.eventType && !booking?.dynamicEventSlugRef) {
    // TODO: Show something in UI to let user know that this booking is not rescheduleable
    return notFound();
  }

  // if booking event type is for a seated event and no seat reference uid is provided, throw not found
  if (booking?.eventType?.seatsPerTimeSlot && !maybeSeatReferenceUid) {
    const userId = session?.user?.id;

    if (!userId && !seatReferenceUid) {
      return redirect(`/auth/login?callbackUrl=/reschedule/${bookingUid}`);
    }
    const userIsHost = booking?.eventType.hosts.find((host) => host.user.id === userId);

    const userIsOwnerOfEventType = booking?.eventType.owner?.id === userId;

    if (!userIsHost && !userIsOwnerOfEventType) {
      return notFound();
    }
  }

  const eventType = booking.eventType ? booking.eventType : getDefaultEvent(dynamicEventSlugRef);

  const eventPage = `${
    eventType.team
      ? `team/${eventType.team.slug}`
      : dynamicEventSlugRef
      ? booking.dynamicGroupSlugRef
      : booking.user?.username || "rick" /* This shouldn't happen */
  }/${eventType?.slug}`;
  const destinationUrl = new URLSearchParams();

  destinationUrl.set("rescheduleUid", seatReferenceUid || bookingUid);

  return redirect(
    `/${eventPage}?${destinationUrl.toString()}${eventType.seatsPerTimeSlot ? "&bookingUid=null" : ""}`
  );
}