import OldPage from "@pages/booking/[uid]";
import { _generateMetadata } from "app/_utils";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import PageWrapper from "@components/PageWrapperAppDir";
import { headers, cookies } from "next/headers";
import { buildLegacyCtx } from "@lib/buildLegacyCtx";
import { notFound, redirect } from "next/navigation";
import { notFound, redirect } from "next/navigation";
ctx: GetServerSidePropsContext
import { BookingStatus } from "@calcom/prisma/enums";
async function getRecurringBookings(recurringEventId: string | null) {
  if (!recurringEventId) return null;
  const recurringBookings = await prisma.booking.findMany({
    where: {
      recurringEventId,
      status: BookingStatus.ACCEPTED,
    },
    select: {
      startTime: true,
    },
  });
  return recurringBookings.map((obj) => obj.startTime.toString());
}
a
const attendee = bookingInfo?.attendees?.find((a) => {
        return a.email === seatAttendee.attendee?.email;
      });
const seatAttendee = await prisma.bookingSeat.findFirst({
      where: {
        referenceUid: seatReferenceUid,
      },
      include: {
        attendee: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
userId?: number
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >
import type { Prisma } from "@calcom/prisma/client";
eventType: {
    seatsPerTimeSlot?: number | null;
    seatsShowAttendees: boolean | null;
    seatsShowAvailabilityCount: boolean | null;
    [x: string | number | symbol]: unknown;
  }
eventType: {
    seatsPerTimeSlot?: number | null;
    seatsShowAttendees: boolean | null;
    seatsShowAvailabilityCount: boolean | null;
    [x: string | number | symbol]: unknown;
  }
eventType: {
    seatsPerTimeSlot?: number | null;
    seatsShowAttendees: boolean | null;
    seatsShowAvailabilityCount: boolean | null;
    [x: string | number | symbol]: unknown;
  }
const handleSeatsEventTypeOnBooking = async (
  eventType: {
    seatsPerTimeSlot?: number | null;
    seatsShowAttendees: boolean | null;
    seatsShowAvailabilityCount: boolean | null;
    [x: string | number | symbol]: unknown;
  },
  bookingInfo: Partial<
    Prisma.BookingGetPayload<{
      include: {
        attendees: { select: { name: true; email: true } };
        seatsReferences: { select: { referenceUid: true } };
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            username: true;
            timeZone: true;
          };
        };
      };
    }>
  >,
  seatReferenceUid?: string,
  userId?: number
) => {
  if (eventType?.seatsPerTimeSlot !== null) {
    // @TODO: right now bookings with seats doesn't save every description that its entered by every user
    delete bookingInfo.description;
  } else {
    return;
  }
  // @TODO: If handling teams, we need to do more check ups for this.
  if (bookingInfo?.user?.id === userId) {
    return;
  }

  if (!eventType.seatsShowAttendees) {
    const seatAttendee = await prisma.bookingSeat.findFirst({
      where: {
        referenceUid: seatReferenceUid,
      },
      include: {
        attendee: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (seatAttendee) {
      const attendee = bookingInfo?.attendees?.find((a) => {
        return a.email === seatAttendee.attendee?.email;
      });
      bookingInfo["attendees"] = attendee ? [attendee] : [];
    } else {
      bookingInfo["attendees"] = [];
    }
  }
  return bookingInfo;
};
import { bookingMetadataSchema, customInputSchema, EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";
import { parseRecurringEvent } from "@calcom/lib";
import { getBookingWithResponses } from "@calcom/features/bookings/lib/get-booking";
import { getBookingFieldsWithSystemFields } from "@calcom/features/bookings/lib/getBookingFields";
import { bookingMetadataSchema, customInputSchema, EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";
const metadata = EventTypeMetaDataSchema.parse(eventType.metadata);
eventType: {
    seatsPerTimeSlot?: number | null;
    seatsShowAttendees: boolean | null;
    seatsShowAvailabilityCount: boolean | null;
    [x: string | number | symbol]: unknown;
  }
const userSelect = {
    id: true,
    name: true,
    username: true,
    hideBranding: true,
    theme: true,
    brandColor: true,
    darkBrandColor: true,
    email: true,
    timeZone: true,
  };
const getEventTypesFromDB = async (id: number) => {
  const userSelect = {
    id: true,
    name: true,
    username: true,
    hideBranding: true,
    theme: true,
    brandColor: true,
    darkBrandColor: true,
    email: true,
    timeZone: true,
  };
  const eventType = await prisma.eventType.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      length: true,
      eventName: true,
      recurringEvent: true,
      requiresConfirmation: true,
      userId: true,
      successRedirectUrl: true,
      customInputs: true,
      locations: true,
      price: true,
      currency: true,
      bookingFields: true,
      disableGuests: true,
      timeZone: true,
      owner: {
        select: userSelect,
      },
      users: {
        select: userSelect,
      },
      hosts: {
        select: {
          user: {
            select: userSelect,
          },
        },
      },
      team: {
        select: {
          slug: true,
          name: true,
          hideBranding: true,
        },
      },
      workflows: {
        select: {
          workflow: {
            select: {
              id: true,
              steps: true,
            },
          },
        },
      },
      metadata: true,
      seatsPerTimeSlot: true,
      seatsShowAttendees: true,
      seatsShowAvailabilityCount: true,
      periodStartDate: true,
      periodEndDate: true,
    },
  });

  if (!eventType) {
    return eventType;
  }

  const metadata = EventTypeMetaDataSchema.parse(eventType.metadata);

  return {
    isDynamic: false,
    ...eventType,
    bookingFields: getBookingFieldsWithSystemFields(eventType),
    metadata,
  };
};
import { getDefaultEvent } from "@calcom/lib/defaultEvents";
import prisma from "@calcom/prisma";
import { maybeGetBookingUidFromSeat } from "@calcom/lib/server/maybeGetBookingUidFromSeat";
import { z } from "zod";
const querySchema = z.object({
  uid: z.string(),
  email: z.string().optional(),
  eventTypeSlug: z.string().optional(),
  cancel: stringToBoolean,
  allRemainingBookings: stringToBoolean,
  changes: stringToBoolean,
  reschedule: stringToBoolean,
  isSuccessBookingPage: stringToBoolean,
  formerTime: z.string().optional(),
  seatReferenceUid: z.string().optional(),
});
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { ssrInit } from "@server/lib/ssr";
import type { GetServerSidePropsContext } from "next";
async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssr = await ssrInit(context);
  const session = await getServerSession(context);
  let tz: string | null = null;
  let userTimeFormat: number | null = null;
  let requiresLoginToUpdate = false;
  if (session) {
    const user = await ssr.viewer.me.fetch();
    tz = user.timeZone;
    userTimeFormat = user.timeFormat;
  }

  const parsedQuery = querySchema.safeParse(context.query);

  if (!parsedQuery.success) return { notFound: true } as const;
  const { uid, eventTypeSlug, seatReferenceUid } = parsedQuery.data;

  const { uid: maybeUid } = await maybeGetBookingUidFromSeat(prisma, uid);
  const bookingInfoRaw = await prisma.booking.findFirst({
    where: {
      uid: maybeUid,
    },
    select: {
      title: true,
      id: true,
      uid: true,
      description: true,
      customInputs: true,
      smsReminderNumber: true,
      recurringEventId: true,
      startTime: true,
      endTime: true,
      location: true,
      status: true,
      metadata: true,
      cancellationReason: true,
      responses: true,
      rejectionReason: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          timeZone: true,
        },
      },
      attendees: {
        select: {
          name: true,
          email: true,
          timeZone: true,
        },
      },
      eventTypeId: true,
      eventType: {
        select: {
          eventName: true,
          slug: true,
          timeZone: true,
        },
      },
      seatsReferences: {
        select: {
          referenceUid: true,
        },
      },
    },
  });
  if (!bookingInfoRaw) {
    return {
      notFound: true,
    } as const;
  }

  const eventTypeRaw = !bookingInfoRaw.eventTypeId
    ? getDefaultEvent(eventTypeSlug || "")
    : await getEventTypesFromDB(bookingInfoRaw.eventTypeId);
  if (!eventTypeRaw) {
    return {
      notFound: true,
    } as const;
  }

  if (eventTypeRaw.seatsPerTimeSlot && !seatReferenceUid && !session) {
    requiresLoginToUpdate = true;
  }

  const bookingInfo = getBookingWithResponses(bookingInfoRaw);
  // @NOTE: had to do this because Server side cant return [Object objects]
  // probably fixable with json.stringify -> json.parse
  bookingInfo["startTime"] = (bookingInfo?.startTime as Date)?.toISOString() as unknown as Date;
  bookingInfo["endTime"] = (bookingInfo?.endTime as Date)?.toISOString() as unknown as Date;

  eventTypeRaw.users = !!eventTypeRaw.hosts?.length
    ? eventTypeRaw.hosts.map((host) => host.user)
    : eventTypeRaw.users;

  if (!eventTypeRaw.users.length) {
    if (!eventTypeRaw.owner)
      return {
        notFound: true,
      } as const;
    eventTypeRaw.users.push({
      ...eventTypeRaw.owner,
    });
  }

  const eventType = {
    ...eventTypeRaw,
    periodStartDate: eventTypeRaw.periodStartDate?.toString() ?? null,
    periodEndDate: eventTypeRaw.periodEndDate?.toString() ?? null,
    metadata: EventTypeMetaDataSchema.parse(eventTypeRaw.metadata),
    recurringEvent: parseRecurringEvent(eventTypeRaw.recurringEvent),
    customInputs: customInputSchema.array().parse(eventTypeRaw.customInputs),
  };

  const profile = {
    name: eventType.team?.name || eventType.users[0]?.name || null,
    email: eventType.team ? null : eventType.users[0].email || null,
    theme: (!eventType.team?.name && eventType.users[0]?.theme) || null,
    brandColor: eventType.team ? null : eventType.users[0].brandColor || null,
    darkBrandColor: eventType.team ? null : eventType.users[0].darkBrandColor || null,
    slug: eventType.team?.slug || eventType.users[0]?.username || null,
  };

  if (bookingInfo !== null && eventType.seatsPerTimeSlot) {
    await handleSeatsEventTypeOnBooking(eventType, bookingInfo, seatReferenceUid, session?.user.id);
  }

  const payment = await prisma.payment.findFirst({
    where: {
      bookingId: bookingInfo.id,
    },
    select: {
      success: true,
      refunded: true,
      currency: true,
      amount: true,
      paymentOption: true,
    },
  });

  return {
    props: {
      themeBasis: eventType.team ? eventType.team.slug : eventType.users[0]?.username,
      hideBranding: eventType.team ? eventType.team.hideBranding : eventType.users[0].hideBranding,
      profile,
      eventType,
      recurringBookings: await getRecurringBookings(bookingInfo.recurringEventId),
      trpcState: ssr.dehydrate(),
      dynamicEventName: bookingInfo?.eventType?.eventName || "",
      bookingInfo,
      paymentStatus: payment,
      ...(tz && { tz }),
      userTimeFormat,
      requiresLoginToUpdate,
    },
  };
}
const result = await getServerSideProps(ctx);const getData = async (ctx: GetServerSidePropsContext) => {
    const result = await getServerSideProps(ctx);
    
    if("redirect" in result) {
        redirect(result.redirect.destination);	
    }
    
    if("notFound" in result) {
        notFound();
    }
    
    return "props" in result ? result.props : {};
} 




export const generateMetadata = async () => await _generateMetadata(() => "", () => "");

type PageProps = Readonly<{
	params: Params;
}>;

const Page = async ({ params }: PageProps) => {
	const h = headers();
	const nonce = h.get("x-nonce") ?? undefined;
	
	const legacyCtx = buildLegacyCtx(headers(), cookies(), params);
	const props = await getData(legacyCtx);
	
	return (
		<PageWrapper  requiresLicense={false} nonce={nonce} themeBasis={null}>
			<OldPage {...props} />
		</PageWrapper>
	);
};
	
export default Page;