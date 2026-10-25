import * as zod_v4_core from 'zod/v4/core';
import * as zod from 'zod';
import { z } from 'zod';

declare const BldEventTemplatesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    eventTypeId: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    name: z.ZodString;
    lessons: z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        dance: z.ZodNullable<z.ZodString>;
        level: z.ZodNullable<z.ZodString>;
        link: z.ZodNull;
    }, z.core.$strict>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
type BldEventTemplates = z.infer<typeof BldEventTemplatesSchema>;

declare const BldEventTypesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    title: z.ZodString;
    level: z.ZodString;
    price: z.ZodString;
    defaultStartTime: z.ZodString;
    defaultDurationMinutes: z.ZodNumber;
    isActive: z.ZodBoolean;
    venueId: z.ZodString;
    updatedAt: z.ZodOptional<z.ZodDate>;
    endDayOffset: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strict>;
type BldEventTypes = z.infer<typeof BldEventTypesSchema>;

declare const BldEventsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    date: z.ZodString;
    eventTypeId: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    startTime: z.ZodString;
    durationMinutes: z.ZodNumber;
    lessons: z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        dance: z.ZodNullable<z.ZodString>;
        level: z.ZodNullable<z.ZodString>;
        link: z.ZodNullable<z.ZodString>;
        committed: z.ZodBoolean;
        danceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    substitute: z.ZodNullable<z.ZodString>;
    cancelNote: z.ZodNullable<z.ZodString>;
    isCancelled: z.ZodBoolean;
    updatedAt: z.ZodOptional<z.ZodDate>;
    endTime: z.ZodOptional<z.ZodString>;
    endDayOffset: z.ZodOptional<z.ZodNumber>;
    specialNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
type BldEvents = z.infer<typeof BldEventsSchema>;

declare const BldFrequenciesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    eventTypeId: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    kind: z.ZodString;
    byDay: z.ZodOptional<z.ZodArray<z.ZodString>>;
    startTime: z.ZodString;
    durationMinutes: z.ZodNumber;
    startDate: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    weekday: z.ZodOptional<z.ZodString>;
    nth: z.ZodOptional<z.ZodNumber>;
    endDate: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strict>;
type BldFrequencies = z.infer<typeof BldFrequenciesSchema>;

declare const BldLessonsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    danceId: z.ZodOptional<z.ZodString>;
    venue: z.ZodString;
    date: z.ZodString;
    danceName: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type BldLessons = z.infer<typeof BldLessonsSchema>;

declare const CopperknobAlertProcessedItemsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    guid: z.ZodString;
    danceTitle: z.ZodString;
    details: z.ZodObject<{
        method: z.ZodString;
        score: z.ZodNumber;
        choreographer: z.ZodString;
    }, z.core.$strict>;
    matchedRule: z.ZodString;
    processedAt: z.ZodDate;
    status: z.ZodString;
    submitUrl: z.ZodString;
    youtubeUrl: z.ZodNull;
}, z.core.$strict>;
type CopperknobAlertProcessedItems = z.infer<typeof CopperknobAlertProcessedItemsSchema>;

declare const CopperknobAlertSyncMetadataSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    key: z.ZodString;
    lastPublishedCount: z.ZodNumber;
    lastRunAt: z.ZodString;
}, z.core.$strict>;
type CopperknobAlertSyncMetadata = z.infer<typeof CopperknobAlertSyncMetadataSchema>;

declare const CopperknobAlertWatchRulesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    id: z.ZodString;
    checkIntervalMinutes: z.ZodNumber;
    choreographer: z.ZodString;
    danceName: z.ZodString;
    fuzzyThreshold: z.ZodNumber;
    lastCheckedAt: z.ZodString;
}, z.core.$strict>;
type CopperknobAlertWatchRules = z.infer<typeof CopperknobAlertWatchRulesSchema>;

declare const DjfeedAttendeeNotificationsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    recipientId: z.ZodString;
    type: z.ZodString;
    fromDjId: z.ZodString;
    fromName: z.ZodString;
    beats: z.ZodNumber;
    message: z.ZodString;
    read: z.ZodBoolean;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedAttendeeNotifications = z.infer<typeof DjfeedAttendeeNotificationsSchema>;

declare const DjfeedBeatBalancesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    attendeeId: z.ZodString;
    beats: z.ZodNumber;
    updatedAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedBeatBalances = z.infer<typeof DjfeedBeatBalancesSchema>;

declare const DjfeedBeatTransactionsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    attendeeId: z.ZodString;
    type: z.ZodString;
    beats: z.ZodNumber;
    amountCents: z.ZodOptional<z.ZodNumber>;
    stripePaymentIntentId: z.ZodOptional<z.ZodString>;
    stripeSessionId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    requestId: z.ZodOptional<z.ZodString>;
    djId: z.ZodOptional<z.ZodString>;
    fromDjId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type DjfeedBeatTransactions = z.infer<typeof DjfeedBeatTransactionsSchema>;

declare const DjfeedDancerFavoriteSongsSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    trackId: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedDancerFavoriteSongs = z.infer<typeof DjfeedDancerFavoriteSongsSchema>;

declare const DjfeedDjDirectMessagesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    senderId: z.ZodString;
    recipientId: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
    status: z.ZodString;
    createdAt: z.ZodDate;
    expiresAt: z.ZodNullable<z.ZodDate>;
    recipientClientId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type DjfeedDjDirectMessages = z.infer<typeof DjfeedDjDirectMessagesSchema>;

declare const DjfeedDjMessagesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    sessionId: z.ZodString;
    ownerId: z.ZodString;
    text: z.ZodString;
    status: z.ZodString;
    duration: z.ZodNullable<z.ZodNumber>;
    createdAt: z.ZodDate;
    expiresAt: z.ZodNullable<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    sendToAll: z.ZodOptional<z.ZodBoolean>;
    migratedFrom: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type DjfeedDjMessages = z.infer<typeof DjfeedDjMessagesSchema>;

declare const DjfeedDjNotificationsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    ownerId: z.ZodString;
    type: z.ZodString;
    amountCents: z.ZodNumber;
    senderName: z.ZodString;
    senderEmail: z.ZodString;
    read: z.ZodBoolean;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedDjNotifications = z.infer<typeof DjfeedDjNotificationsSchema>;

declare const DjfeedDjProfilesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    ownerId: z.ZodString;
    createdAt: z.ZodDate;
    stripeAccountId: z.ZodString;
    updatedAt: z.ZodDate;
    paymentLinks: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        url: z.ZodString;
    }, z.core.$strict>>;
    feedTemplates: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        designedFor: z.ZodString;
        slides: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            duration: z.ZodNumber;
            grid: z.ZodObject<{
                cols: z.ZodNumber;
                rows: z.ZodNumber;
            }, z.core.$strict>;
            elements: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodString;
                col: z.ZodNumber;
                row: z.ZodNumber;
                colSpan: z.ZodNumber;
                rowSpan: z.ZodNumber;
                src: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
type DjfeedDjProfiles = z.infer<typeof DjfeedDjProfilesSchema>;

declare const DjfeedDjRequesterNicknamesSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    djId: z.ZodString;
    clientId: z.ZodString;
    nickname: z.ZodString;
    updatedAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedDjRequesterNicknames = z.infer<typeof DjfeedDjRequesterNicknamesSchema>;

declare const DjfeedDjRequestsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    sessionId: z.ZodString;
    ownerId: z.ZodString;
    danceId: z.ZodNullable<z.ZodString>;
    danceName: z.ZodString;
    songName: z.ZodString;
    artist: z.ZodString;
    difficulty: z.ZodString;
    stepsheet: z.ZodString;
    duration_ms: z.ZodNullable<z.ZodNumber>;
    spotifyUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    clientId: z.ZodString;
    requesterName: z.ZodString;
    notes: z.ZodString;
    danceType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isSongSwap: z.ZodOptional<z.ZodBoolean>;
    swapSongName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    swapArtist: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tipCents: z.ZodOptional<z.ZodNumber>;
    isRepeat: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodString;
    queuePosition: z.ZodNullable<z.ZodNumber>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    advancedBy: z.ZodOptional<z.ZodString>;
    playStartedAt: z.ZodOptional<z.ZodDate>;
    pausedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    partnerStyle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partnerGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    localTrackKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    catalogTrackId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isrcs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tempo: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    playLengthMs: z.ZodOptional<z.ZodNumber>;
    volumeDb: z.ZodOptional<z.ZodNumber>;
    migratedFrom: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type DjfeedDjRequests = z.infer<typeof DjfeedDjRequestsSchema>;

declare const DjfeedDjSessionsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    ownerId: z.ZodString;
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    status: z.ZodString;
    plugin: z.ZodOptional<z.ZodString>;
    startedAt: z.ZodNullable<z.ZodDate>;
    endsAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    closedAt: z.ZodNullable<z.ZodDate>;
    partnerDancesEnabled: z.ZodOptional<z.ZodBoolean>;
    weightDecayEnabled: z.ZodOptional<z.ZodBoolean>;
    weightDecayHalfLifeMinutes: z.ZodOptional<z.ZodNumber>;
    tippingEnabled: z.ZodOptional<z.ZodBoolean>;
    autoClosedAt: z.ZodOptional<z.ZodDate>;
    fairnessScoringEnabled: z.ZodOptional<z.ZodBoolean>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
    queueVisibleCount: z.ZodOptional<z.ZodNumber>;
    feedTemplateId: z.ZodOptional<z.ZodString>;
    feedAppliedAt: z.ZodOptional<z.ZodString>;
    feedAspectRatio: z.ZodOptional<z.ZodString>;
    requestsEnabled: z.ZodOptional<z.ZodBoolean>;
    suppressedClientIds: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    addOns: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    migratedFrom: z.ZodOptional<z.ZodString>;
    shareTimeZone: z.ZodOptional<z.ZodString>;
    shareToken: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type DjfeedDjSessions = z.infer<typeof DjfeedDjSessionsSchema>;

declare const DjfeedDjWalletLocksSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type DjfeedDjWalletLocks = z.infer<typeof DjfeedDjWalletLocksSchema>;

declare const DjfeedDjWalletTransactionsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    ownerId: z.ZodString;
    type: z.ZodString;
    amountCents: z.ZodNumber;
    requestId: z.ZodOptional<z.ZodString>;
    attendeeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodDate;
    stripeSessionId: z.ZodOptional<z.ZodString>;
    senderName: z.ZodOptional<z.ZodString>;
    senderEmail: z.ZodOptional<z.ZodString>;
    originalWalletTxId: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    recipientId: z.ZodOptional<z.ZodString>;
    recipientEmail: z.ZodOptional<z.ZodString>;
    beats: z.ZodOptional<z.ZodNumber>;
    sessionId: z.ZodOptional<z.ZodString>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
    addOns: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
}, z.core.$strict>;
type DjfeedDjWalletTransactions = z.infer<typeof DjfeedDjWalletTransactionsSchema>;

declare const DjfeedFeedLessonsSchema: z.ZodObject<{
    _id: z.ZodString;
    sessionId: z.ZodString;
    hostId: z.ZodString;
    danceId: z.ZodString;
    startedAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedFeedLessons = z.infer<typeof DjfeedFeedLessonsSchema>;

declare const DjfeedFreeAccessSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    email: z.ZodString;
    expiresAt: z.ZodNullable<z.ZodDate>;
    note: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedFreeAccess = z.infer<typeof DjfeedFreeAccessSchema>;

declare const DjfeedHostDancersSchema: z.ZodObject<{
    _id: z.ZodString;
    hostId: z.ZodString;
    userId: z.ZodString;
    firstSeenAt: z.ZodDate;
    lastSeenAt: z.ZodDate;
    sessionCount: z.ZodNumber;
    lastSessionId: z.ZodString;
}, z.core.$strict>;
type DjfeedHostDancers = z.infer<typeof DjfeedHostDancersSchema>;

declare const DjfeedLessonChecksSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    feedLessonId: z.ZodString;
    answer: z.ZodEnum<{
        known: "known";
        refresh: "refresh";
        not_taken: "not_taken";
    }>;
    answeredAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedLessonChecks = z.infer<typeof DjfeedLessonChecksSchema>;

declare const DjfeedRequesterHistorySchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    clientId: z.ZodString;
    sessionId: z.ZodString;
    ownerId: z.ZodString;
    requesterName: z.ZodString;
    requests: z.ZodArray<z.ZodObject<{
        danceName: z.ZodString;
        danceId: z.ZodNullable<z.ZodString>;
        status: z.ZodString;
        tipCents: z.ZodNumber;
        createdAt: z.ZodDate;
    }, z.core.$strict>>;
    sessionDate: z.ZodDate;
    sessionName: z.ZodString;
}, z.core.$strict>;
type DjfeedRequesterHistory = z.infer<typeof DjfeedRequesterHistorySchema>;

declare const DjfeedSessionAttendanceSchema: z.ZodObject<{
    _id: z.ZodString;
    sessionId: z.ZodString;
    userId: z.ZodString;
    firstSeenAt: z.ZodDate;
    hostId: z.ZodString;
    lastSeenAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedSessionAttendance = z.infer<typeof DjfeedSessionAttendanceSchema>;

declare const DjfeedSessionReportsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    sessionId: z.ZodString;
    actualDurationMs: z.ZodNumber;
    autoClosedAt: z.ZodNullable<z.ZodDate>;
    closedAt: z.ZodDate;
    endsAt: z.ZodDate;
    extensions: z.ZodArray<z.ZodUnknown>;
    generatedAt: z.ZodDate;
    ownerId: z.ZodString;
    playedTracks: z.ZodArray<z.ZodObject<{
        danceName: z.ZodString;
        danceId: z.ZodNullable<z.ZodString>;
        songName: z.ZodString;
        artist: z.ZodString;
        difficulty: z.ZodString;
        stepsheet: z.ZodOptional<z.ZodString>;
        danceType: z.ZodNullable<z.ZodString>;
        partnerStyle: z.ZodNullable<z.ZodString>;
        isSongSwap: z.ZodOptional<z.ZodBoolean>;
        swapSongName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        swapArtist: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        playedAt: z.ZodDate;
        requesters: z.ZodArray<z.ZodObject<{
            clientId: z.ZodString;
            requesterName: z.ZodString;
            tipCents: z.ZodNumber;
        }, z.core.$strict>>;
        totalTips: z.ZodNumber;
        requesterCount: z.ZodNumber;
        catalogTrackId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    sessionName: z.ZodString;
    startedAt: z.ZodDate;
    stats: z.ZodObject<{
        totalDancesPlayed: z.ZodNumber;
        totalRequests: z.ZodNumber;
        totalApproved: z.ZodNumber;
        totalSkipped: z.ZodNumber;
        totalPending: z.ZodNumber;
        approvalRate: z.ZodNullable<z.ZodNumber>;
        totalTipCents: z.ZodNumber;
        uniqueRequesters: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
type DjfeedSessionReports = z.infer<typeof DjfeedSessionReportsSchema>;

declare const DjfeedSessionTransactionsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    ownerId: z.ZodString;
    type: z.ZodString;
    sessionId: z.ZodString;
    sessionName: z.ZodString;
    durationMinutes: z.ZodNumber;
    amountCents: z.ZodNumber;
    stripeSessionId: z.ZodString;
    stripePaymentIntentId: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedSessionTransactions = z.infer<typeof DjfeedSessionTransactionsSchema>;

declare const DjfeedStripeEventsSchema: z.ZodObject<{
    _id: z.ZodString;
    type: z.ZodString;
    receivedAt: z.ZodDate;
}, z.core.$strict>;
type DjfeedStripeEvents = z.infer<typeof DjfeedStripeEventsSchema>;

declare const LdcoChoreographersSchema: z.ZodObject<{
    _id: z.ZodString;
    name: z.ZodString;
    copperknobUrl: z.ZodOptional<z.ZodString>;
    lastImportedAt: z.ZodOptional<z.ZodString>;
    associatedUserId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoChoreographers = z.infer<typeof LdcoChoreographersSchema>;

declare const LdcoDanceCollectionsSchema: z.ZodObject<{
    _id: z.ZodString;
    name: z.ZodString;
    danceIds: z.ZodArray<z.ZodString>;
    createdBy: z.ZodString;
    createdAt: z.ZodNullable<z.ZodDate>;
    updatedAt: z.ZodNullable<z.ZodDate>;
    isPrivate: z.ZodOptional<z.ZodBoolean>;
    archived: z.ZodOptional<z.ZodBoolean>;
    archivedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    isArchived: z.ZodOptional<z.ZodBoolean>;
    isCopyable: z.ZodOptional<z.ZodBoolean>;
    pendingDanceIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
type LdcoDanceCollections = z.infer<typeof LdcoDanceCollectionsSchema>;

declare const LdcoDanceTracksSchema: z.ZodObject<{
    _id: z.ZodString;
    danceId: z.ZodString;
    trackId: z.ZodString;
    isPrimary: z.ZodBoolean;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type LdcoDanceTracks = z.infer<typeof LdcoDanceTracksSchema>;

declare const LdcoDancesSchema: z.ZodObject<{
    _id: z.ZodString;
    difficulty: z.ZodString;
    tracks: z.ZodArray<z.ZodString>;
    primaryTrack: z.ZodString;
    danceName: z.ZodString;
    choreographers: z.ZodArray<z.ZodString>;
    stepsheet: z.ZodOptional<z.ZodString>;
    stepsheetUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    songArtists: z.ZodOptional<z.ZodArray<z.ZodObject<{
        song: z.ZodString;
        artist: z.ZodString;
    }, z.core.$strict>>>;
    publishedAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strict>;
type LdcoDances = z.infer<typeof LdcoDancesSchema>;

declare const LdcoEventsSchema: z.ZodObject<{
    _id: z.ZodString;
    venueId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    eventDay: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    createdBy: z.ZodString;
}, z.core.$strict>;
type LdcoEvents = z.infer<typeof LdcoEventsSchema>;

declare const LdcoFriendRequestsSchema: z.ZodObject<{
    _id: z.ZodString;
    requesterId: z.ZodString;
    requesteeId: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    timestamp: z.ZodOptional<z.ZodDate>;
}, z.core.$strict>;
type LdcoFriendRequests = z.infer<typeof LdcoFriendRequestsSchema>;

declare const LdcoInstructorVenuesSchema: z.ZodObject<{
    _id: z.ZodString;
    instructorId: z.ZodString;
    venueId: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strict>;
type LdcoInstructorVenues = z.infer<typeof LdcoInstructorVenuesSchema>;

declare const LdcoInstructorsSchema: z.ZodObject<{
    _id: z.ZodString;
    name: z.ZodString;
    associatedUserId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoInstructors = z.infer<typeof LdcoInstructorsSchema>;

declare const LdcoLessonsSchema: z.ZodObject<{
    _id: z.ZodString;
    lessonday: z.ZodString;
    lessonstart: z.ZodString;
    instructors: z.ZodArray<z.ZodString>;
    duration: z.ZodString;
    lessoncost: z.ZodString;
    notes: z.ZodString;
    difficulty: z.ZodString;
    venueid: z.ZodString;
    verifiedAt: z.ZodNull;
    verifiedBy: z.ZodNull;
}, z.core.$strict>;
type LdcoLessons = z.infer<typeof LdcoLessonsSchema>;

declare const LdcoLoginEventsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    userId: z.ZodString;
    email: z.ZodString;
    provider: z.ZodString;
    app: z.ZodString;
    ip: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    clientId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    debugReturnToCookie: z.ZodOptional<z.ZodNull>;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoLoginEvents = z.infer<typeof LdcoLoginEventsSchema>;

declare const LdcoOauthAuthCodesSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type LdcoOauthAuthCodes = z.infer<typeof LdcoOauthAuthCodesSchema>;

declare const LdcoPendingDancesSchema: z.ZodObject<{
    _id: z.ZodString;
    danceName: z.ZodString;
    songTitle: z.ZodString;
    artist: z.ZodString;
    choreographer: z.ZodString;
    count: z.ZodNull;
    wall: z.ZodNull;
    difficulty: z.ZodString;
    stepsheetUrl: z.ZodNullable<z.ZodString>;
    submittedByUserId: z.ZodString;
    submittedAt: z.ZodDate;
    status: z.ZodString;
}, z.core.$strict>;
type LdcoPendingDances = z.infer<typeof LdcoPendingDancesSchema>;

declare const LdcoTracksSchema: z.ZodObject<{
    _id: z.ZodString;
    isrc: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    artists: z.ZodArray<z.ZodString>;
    uri: z.ZodString;
    duration_ms: z.ZodNumber;
    explicit: z.ZodBoolean;
    preview_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_playable: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoTracks = z.infer<typeof LdcoTracksSchema>;

declare const LdcoUserFavoriteDancesSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    danceId: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type LdcoUserFavoriteDances = z.infer<typeof LdcoUserFavoriteDancesSchema>;

declare const LdcoUserFlaggedDancesSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    danceId: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type LdcoUserFlaggedDances = z.infer<typeof LdcoUserFlaggedDancesSchema>;

declare const LdcoUserFollowCollectionsSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    collectionId: z.ZodString;
    followedAt: z.ZodDate;
}, z.core.$strict>;
type LdcoUserFollowCollections = z.infer<typeof LdcoUserFollowCollectionsSchema>;

declare const LdcoUserFollowsSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    followingId: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type LdcoUserFollows = z.infer<typeof LdcoUserFollowsSchema>;

declare const LdcoUserFriendsSchema: z.ZodObject<{
    _id: z.ZodString;
    userA: z.ZodString;
    userB: z.ZodString;
    timestamp: z.ZodDate;
}, z.core.$strict>;
type LdcoUserFriends = z.infer<typeof LdcoUserFriendsSchema>;

declare const LdcoUserKnownDancesSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    danceId: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type LdcoUserKnownDances = z.infer<typeof LdcoUserKnownDancesSchema>;

declare const LdcoUserLessonsSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    lessonId: z.ZodString;
}, z.core.$strict>;
type LdcoUserLessons = z.infer<typeof LdcoUserLessonsSchema>;

declare const LdcoUserRefreshDancesSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    danceId: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strict>;
type LdcoUserRefreshDances = z.infer<typeof LdcoUserRefreshDancesSchema>;

declare const LdcoUserVenuesSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    venueId: z.ZodString;
}, z.core.$strict>;
type LdcoUserVenues = z.infer<typeof LdcoUserVenuesSchema>;

declare const LdcoUsersSchema: z.ZodObject<{
    _id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    emailVerified: z.ZodOptional<z.ZodNull>;
    bio: z.ZodOptional<z.ZodString>;
    favorites: z.ZodOptional<z.ZodArray<z.ZodString>>;
    flagged: z.ZodOptional<z.ZodArray<z.ZodString>>;
    known: z.ZodOptional<z.ZodArray<z.ZodString>>;
    refresh: z.ZodOptional<z.ZodArray<z.ZodString>>;
    collections: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        danceIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>>;
    password: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    googleId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoUsers = z.infer<typeof LdcoUsersSchema>;

declare const LdcoVenueCheckinsSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    venueId: z.ZodString;
    dateKey: z.ZodString;
    status: z.ZodString;
}, z.core.$strict>;
type LdcoVenueCheckins = z.infer<typeof LdcoVenueCheckinsSchema>;

declare const LdcoVenueUsersSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    venueId: z.ZodString;
    requestedBy: z.ZodString;
}, z.core.$strict>;
type LdcoVenueUsers = z.infer<typeof LdcoVenueUsersSchema>;

declare const LdcoVenuesSchema: z.ZodObject<{
    _id: z.ZodString;
    venuename: z.ZodString;
    venueaddress: z.ZodString;
    geolocation: z.ZodArray<z.ZodNumber>;
    phone: z.ZodString;
    website: z.ZodString;
    timeZone: z.ZodString;
    verifiedAt: z.ZodNull;
    verifiedBy: z.ZodNull;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoVenues = z.infer<typeof LdcoVenuesSchema>;

declare const LdcoEventsEventRegistrationsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    address: z.ZodNullable<z.ZodString>;
    agreedToWaiver: z.ZodBoolean;
    attendeeStatus: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    email: z.ZodString;
    emails: z.ZodOptional<z.ZodArray<z.ZodObject<{
        templateId: z.ZodString;
        subject: z.ZodString;
        sentAt: z.ZodString;
    }, z.core.$strict>>>;
    event: z.ZodString;
    name: z.ZodString;
    paidAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    paymentMethod: z.ZodString;
    paymentStatus: z.ZodString;
    phone: z.ZodNullable<z.ZodString>;
    requestToken: z.ZodString;
    waiverSignature: z.ZodString;
    waiverSignedAt: z.ZodString;
    requests: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        danceId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>>>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    catering: z.ZodOptional<z.ZodBoolean>;
    stripeSessionId: z.ZodOptional<z.ZodNull>;
}, z.core.$strict>;
type LdcoEventsEventRegistrations = z.infer<typeof LdcoEventsEventRegistrationsSchema>;

declare const LdcoEventsEventsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    slug: z.ZodString;
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    date: z.ZodString;
    dateShort: z.ZodString;
    shortTitle: z.ZodString;
    time: z.ZodString;
    title: z.ZodString;
    venueAddress: z.ZodString;
    venueName: z.ZodString;
}, z.core.$strict>;
type LdcoEventsEvents = z.infer<typeof LdcoEventsEventsSchema>;

declare const LdcoLessonsEventInstructorRequestsSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type LdcoLessonsEventInstructorRequests = z.infer<typeof LdcoLessonsEventInstructorRequestsSchema>;

declare const LdcoLessonsEventInstructorsSchema: z.ZodObject<{
    _id: z.ZodString;
    instructorId: z.ZodString;
    eventTypeId: z.ZodString;
    createdAt: z.ZodDate;
    role: z.ZodString;
}, z.core.$strict>;
type LdcoLessonsEventInstructors = z.infer<typeof LdcoLessonsEventInstructorsSchema>;

declare const LdcoLessonsEventTemplatesSchema: z.ZodObject<{
    _id: z.ZodString;
    createdAt: z.ZodDate;
    eventTypeId: z.ZodString;
    isDefault: z.ZodBoolean;
    lessons: z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        dance: z.ZodNullable<z.ZodString>;
        level: z.ZodNullable<z.ZodString>;
        link: z.ZodNull;
    }, z.core.$strict>>;
    name: z.ZodString;
    updatedAt: z.ZodDate;
}, z.core.$strict>;
type LdcoLessonsEventTemplates = z.infer<typeof LdcoLessonsEventTemplatesSchema>;

declare const LdcoLessonsEventTypesSchema: z.ZodObject<{
    _id: z.ZodString;
    createdAt: z.ZodDate;
    createdBy: z.ZodString;
    defaultDurationMinutes: z.ZodNumber;
    defaultStartTime: z.ZodNullable<z.ZodString>;
    isActive: z.ZodBoolean;
    level: z.ZodString;
    price: z.ZodString;
    title: z.ZodString;
    updatedAt: z.ZodDate;
    venueId: z.ZodString;
    verifiedAt: z.ZodNull;
    verifiedBy: z.ZodNull;
}, z.core.$strict>;
type LdcoLessonsEventTypes = z.infer<typeof LdcoLessonsEventTypesSchema>;

declare const LdcoLessonsEventsSchema: z.ZodObject<{
    _id: z.ZodString;
    cancelNote: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
    date: z.ZodString;
    endAt: z.ZodDate;
    eventTypeId: z.ZodString;
    isCancelled: z.ZodBoolean;
    lessons: z.ZodArray<z.ZodObject<{
        _id: z.ZodString;
        startAt: z.ZodDate;
        dance: z.ZodNullable<z.ZodString>;
        danceId: z.ZodNullable<z.ZodString>;
        level: z.ZodNullable<z.ZodString>;
        link: z.ZodNullable<z.ZodString>;
        committed: z.ZodBoolean;
        skipped: z.ZodBoolean;
    }, z.core.$strict>>;
    specialNote: z.ZodNullable<z.ZodString>;
    startAt: z.ZodDate;
    substitute: z.ZodNullable<z.ZodString>;
    substituteInstructorId: z.ZodNull;
    timeZone: z.ZodString;
    updatedAt: z.ZodDate;
    verifiedAt: z.ZodNull;
    verifiedBy: z.ZodNull;
}, z.core.$strict>;
type LdcoLessonsEvents = z.infer<typeof LdcoLessonsEventsSchema>;

declare const LdcoLessonsFrequenciesSchema: z.ZodObject<{
    _id: z.ZodString;
    byDay: z.ZodOptional<z.ZodArray<z.ZodString>>;
    createdAt: z.ZodDate;
    durationMinutes: z.ZodNumber;
    eventTypeId: z.ZodString;
    isActive: z.ZodOptional<z.ZodBoolean>;
    kind: z.ZodString;
    startDate: z.ZodOptional<z.ZodString>;
    startTime: z.ZodString;
    updatedAt: z.ZodDate;
    endDate: z.ZodOptional<z.ZodString>;
    nth: z.ZodOptional<z.ZodNumber>;
    weekday: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoLessonsFrequencies = z.infer<typeof LdcoLessonsFrequenciesSchema>;

declare const LdcoLessonsLessonsSchema: z.ZodObject<{
    _id: z.ZodString;
    danceId: z.ZodOptional<z.ZodString>;
    date: z.ZodDate;
    eventId: z.ZodNullable<z.ZodString>;
    instructorId: z.ZodString;
    lessonId: z.ZodNull;
    venue: z.ZodString;
    venueId: z.ZodString;
    danceName: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type LdcoLessonsLessons = z.infer<typeof LdcoLessonsLessonsSchema>;

declare const LdcoReviewsChoreographersSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type LdcoReviewsChoreographers = z.infer<typeof LdcoReviewsChoreographersSchema>;

declare const LdcoReviewsDancesSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type LdcoReviewsDances = z.infer<typeof LdcoReviewsDancesSchema>;

declare const LdcoReviewsJoinChoreographerAppealsSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type LdcoReviewsJoinChoreographerAppeals = z.infer<typeof LdcoReviewsJoinChoreographerAppealsSchema>;

declare const LdcoReviewsLessonsSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    lessonday: z.ZodString;
    lessonstart: z.ZodString;
    instructors: z.ZodArray<z.ZodString>;
    duration: z.ZodString;
    lessoncost: z.ZodString;
    notes: z.ZodString;
    difficulty: z.ZodString;
    venueid: z.ZodString;
}, z.core.$strict>;
type LdcoReviewsLessons = z.infer<typeof LdcoReviewsLessonsSchema>;

declare const LdcoReviewsReportsSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type LdcoReviewsReports = z.infer<typeof LdcoReviewsReportsSchema>;

declare const LdcoReviewsTracksSchema: z.ZodObject<{
    _id: z.ZodUnion<readonly [z.ZodString, z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>]>;
}, z.core.$loose>;
type LdcoReviewsTracks = z.infer<typeof LdcoReviewsTracksSchema>;

declare const LdcoReviewsVenueUsersSchema: z.ZodObject<{
    _id: z.ZodString;
    userId: z.ZodString;
    venueId: z.ZodString;
    createdAt: z.ZodDate;
    requestedBy: z.ZodString;
}, z.core.$strict>;
type LdcoReviewsVenueUsers = z.infer<typeof LdcoReviewsVenueUsersSchema>;

declare const LdcoReviewsVenuesSchema: z.ZodObject<{
    _id: z.ZodString;
    venuename: z.ZodString;
    venueaddress: z.ZodString;
    geolocation: z.ZodArray<z.ZodNumber>;
    phone: z.ZodString;
    website: z.ZodString;
    contactName: z.ZodString;
    contactEmail: z.ZodString;
    contactPhone: z.ZodString;
    createdAt: z.ZodDate;
    timeZone: z.ZodString;
    verifiedAt: z.ZodNull;
    verifiedBy: z.ZodNull;
}, z.core.$strict>;
type LdcoReviewsVenues = z.infer<typeof LdcoReviewsVenuesSchema>;

declare const LdcoReviewsVerifyUserInstructorSchema: z.ZodObject<{
    _id: z.ZodCustom<{
        toHexString(): string;
    }, {
        toHexString(): string;
    }>;
    userId: z.ZodString;
    instructorId: z.ZodString;
    createdAt: z.ZodDate;
    resolved: z.ZodBoolean;
    resolution: z.ZodString;
    resolvedAt: z.ZodDate;
    resolvedBy: z.ZodString;
}, z.core.$strict>;
type LdcoReviewsVerifyUserInstructor = z.infer<typeof LdcoReviewsVerifyUserInstructorSchema>;

declare const MusicCatalogTracksSchema: z.ZodObject<{
    _id: z.ZodString;
    artist: z.ZodString;
    createdAt: z.ZodDate;
    disambiguation: z.ZodString;
    durationMs: z.ZodNullable<z.ZodNumber>;
    isrcs: z.ZodArray<z.ZodString>;
    nArtist: z.ZodString;
    nTitle: z.ZodString;
    rank: z.ZodNumber;
    rankedAt: z.ZodOptional<z.ZodDate>;
    source: z.ZodString;
    sourceId: z.ZodString;
    title: z.ZodString;
    updatedAt: z.ZodDate;
    variantKey: z.ZodString;
    words: z.ZodArray<z.ZodString>;
    year: z.ZodNullable<z.ZodNumber>;
}, z.core.$strict>;
type MusicCatalogTracks = z.infer<typeof MusicCatalogTracksSchema>;

declare const collections: {
    readonly "bld.event_templates": {
        readonly database: "bld";
        readonly name: "event_templates";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            eventTypeId: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            name: zod.ZodString;
            lessons: zod.ZodArray<zod.ZodObject<{
                time: zod.ZodString;
                dance: zod.ZodNullable<zod.ZodString>;
                level: zod.ZodNullable<zod.ZodString>;
                link: zod.ZodNull;
            }, zod_v4_core.$strict>>;
            createdAt: zod.ZodDate;
            updatedAt: zod.ZodDate;
            isDefault: zod.ZodOptional<zod.ZodBoolean>;
        }, zod_v4_core.$strict>;
    };
    readonly "bld.event_types": {
        readonly database: "bld";
        readonly name: "event_types";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            title: zod.ZodString;
            level: zod.ZodString;
            price: zod.ZodString;
            defaultStartTime: zod.ZodString;
            defaultDurationMinutes: zod.ZodNumber;
            isActive: zod.ZodBoolean;
            venueId: zod.ZodString;
            updatedAt: zod.ZodOptional<zod.ZodDate>;
            endDayOffset: zod.ZodOptional<zod.ZodNumber>;
            createdAt: zod.ZodOptional<zod.ZodDate>;
        }, zod_v4_core.$strict>;
    };
    readonly "bld.events": {
        readonly database: "bld";
        readonly name: "events";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            date: zod.ZodString;
            eventTypeId: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            startTime: zod.ZodString;
            durationMinutes: zod.ZodNumber;
            lessons: zod.ZodArray<zod.ZodObject<{
                time: zod.ZodString;
                dance: zod.ZodNullable<zod.ZodString>;
                level: zod.ZodNullable<zod.ZodString>;
                link: zod.ZodNullable<zod.ZodString>;
                committed: zod.ZodBoolean;
                danceId: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            }, zod_v4_core.$strict>>;
            substitute: zod.ZodNullable<zod.ZodString>;
            cancelNote: zod.ZodNullable<zod.ZodString>;
            isCancelled: zod.ZodBoolean;
            updatedAt: zod.ZodOptional<zod.ZodDate>;
            endTime: zod.ZodOptional<zod.ZodString>;
            endDayOffset: zod.ZodOptional<zod.ZodNumber>;
            specialNote: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
        }, zod_v4_core.$strict>;
    };
    readonly "bld.frequencies": {
        readonly database: "bld";
        readonly name: "frequencies";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            eventTypeId: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            kind: zod.ZodString;
            byDay: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            startTime: zod.ZodString;
            durationMinutes: zod.ZodNumber;
            startDate: zod.ZodOptional<zod.ZodString>;
            isActive: zod.ZodOptional<zod.ZodBoolean>;
            updatedAt: zod.ZodOptional<zod.ZodDate>;
            weekday: zod.ZodOptional<zod.ZodString>;
            nth: zod.ZodOptional<zod.ZodNumber>;
            endDate: zod.ZodOptional<zod.ZodString>;
            createdAt: zod.ZodOptional<zod.ZodDate>;
        }, zod_v4_core.$strict>;
    };
    readonly "bld.lessons": {
        readonly database: "bld";
        readonly name: "lessons";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            danceId: zod.ZodOptional<zod.ZodString>;
            venue: zod.ZodString;
            date: zod.ZodString;
            danceName: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "copperknob_alert.processed_items": {
        readonly database: "copperknob_alert";
        readonly name: "processed_items";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            guid: zod.ZodString;
            danceTitle: zod.ZodString;
            details: zod.ZodObject<{
                method: zod.ZodString;
                score: zod.ZodNumber;
                choreographer: zod.ZodString;
            }, zod_v4_core.$strict>;
            matchedRule: zod.ZodString;
            processedAt: zod.ZodDate;
            status: zod.ZodString;
            submitUrl: zod.ZodString;
            youtubeUrl: zod.ZodNull;
        }, zod_v4_core.$strict>;
    };
    readonly "copperknob_alert.sync_metadata": {
        readonly database: "copperknob_alert";
        readonly name: "sync_metadata";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            key: zod.ZodString;
            lastPublishedCount: zod.ZodNumber;
            lastRunAt: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "copperknob_alert.watch_rules": {
        readonly database: "copperknob_alert";
        readonly name: "watch_rules";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            id: zod.ZodString;
            checkIntervalMinutes: zod.ZodNumber;
            choreographer: zod.ZodString;
            danceName: zod.ZodString;
            fuzzyThreshold: zod.ZodNumber;
            lastCheckedAt: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.attendee_notifications": {
        readonly database: "djfeed";
        readonly name: "attendee_notifications";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            recipientId: zod.ZodString;
            type: zod.ZodString;
            fromDjId: zod.ZodString;
            fromName: zod.ZodString;
            beats: zod.ZodNumber;
            message: zod.ZodString;
            read: zod.ZodBoolean;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.beat_balances": {
        readonly database: "djfeed";
        readonly name: "beat_balances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            attendeeId: zod.ZodString;
            beats: zod.ZodNumber;
            updatedAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.beat_transactions": {
        readonly database: "djfeed";
        readonly name: "beat_transactions";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            attendeeId: zod.ZodString;
            type: zod.ZodString;
            beats: zod.ZodNumber;
            amountCents: zod.ZodOptional<zod.ZodNumber>;
            stripePaymentIntentId: zod.ZodOptional<zod.ZodString>;
            stripeSessionId: zod.ZodOptional<zod.ZodString>;
            createdAt: zod.ZodDate;
            requestId: zod.ZodOptional<zod.ZodString>;
            djId: zod.ZodOptional<zod.ZodString>;
            fromDjId: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dancer_favorite_songs": {
        readonly database: "djfeed";
        readonly name: "dancer_favorite_songs";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            trackId: zod.ZodString;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_direct_messages": {
        readonly database: "djfeed";
        readonly name: "dj_direct_messages";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            senderId: zod.ZodString;
            recipientId: zod.ZodOptional<zod.ZodString>;
            text: zod.ZodString;
            status: zod.ZodString;
            createdAt: zod.ZodDate;
            expiresAt: zod.ZodNullable<zod.ZodDate>;
            recipientClientId: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_messages": {
        readonly database: "djfeed";
        readonly name: "dj_messages";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            sessionId: zod.ZodString;
            ownerId: zod.ZodString;
            text: zod.ZodString;
            status: zod.ZodString;
            duration: zod.ZodNullable<zod.ZodNumber>;
            createdAt: zod.ZodDate;
            expiresAt: zod.ZodNullable<zod.ZodDate>;
            updatedAt: zod.ZodOptional<zod.ZodDate>;
            sendToAll: zod.ZodOptional<zod.ZodBoolean>;
            migratedFrom: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_notifications": {
        readonly database: "djfeed";
        readonly name: "dj_notifications";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            ownerId: zod.ZodString;
            type: zod.ZodString;
            amountCents: zod.ZodNumber;
            senderName: zod.ZodString;
            senderEmail: zod.ZodString;
            read: zod.ZodBoolean;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_profiles": {
        readonly database: "djfeed";
        readonly name: "dj_profiles";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            ownerId: zod.ZodString;
            createdAt: zod.ZodDate;
            stripeAccountId: zod.ZodString;
            updatedAt: zod.ZodDate;
            paymentLinks: zod.ZodArray<zod.ZodObject<{
                label: zod.ZodString;
                url: zod.ZodString;
            }, zod_v4_core.$strict>>;
            feedTemplates: zod.ZodArray<zod.ZodObject<{
                id: zod.ZodString;
                name: zod.ZodString;
                designedFor: zod.ZodString;
                slides: zod.ZodArray<zod.ZodObject<{
                    id: zod.ZodString;
                    name: zod.ZodString;
                    duration: zod.ZodNumber;
                    grid: zod.ZodObject<{
                        cols: zod.ZodNumber;
                        rows: zod.ZodNumber;
                    }, zod_v4_core.$strict>;
                    elements: zod.ZodArray<zod.ZodObject<{
                        id: zod.ZodString;
                        type: zod.ZodString;
                        col: zod.ZodNumber;
                        row: zod.ZodNumber;
                        colSpan: zod.ZodNumber;
                        rowSpan: zod.ZodNumber;
                        src: zod.ZodOptional<zod.ZodString>;
                    }, zod_v4_core.$strict>>;
                }, zod_v4_core.$strict>>;
                createdAt: zod.ZodString;
                updatedAt: zod.ZodOptional<zod.ZodString>;
            }, zod_v4_core.$strict>>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_requester_nicknames": {
        readonly database: "djfeed";
        readonly name: "dj_requester_nicknames";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            djId: zod.ZodString;
            clientId: zod.ZodString;
            nickname: zod.ZodString;
            updatedAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_requests": {
        readonly database: "djfeed";
        readonly name: "dj_requests";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            sessionId: zod.ZodString;
            ownerId: zod.ZodString;
            danceId: zod.ZodNullable<zod.ZodString>;
            danceName: zod.ZodString;
            songName: zod.ZodString;
            artist: zod.ZodString;
            difficulty: zod.ZodString;
            stepsheet: zod.ZodString;
            duration_ms: zod.ZodNullable<zod.ZodNumber>;
            spotifyUri: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            clientId: zod.ZodString;
            requesterName: zod.ZodString;
            notes: zod.ZodString;
            danceType: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            isSongSwap: zod.ZodOptional<zod.ZodBoolean>;
            swapSongName: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            swapArtist: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            tipCents: zod.ZodOptional<zod.ZodNumber>;
            isRepeat: zod.ZodOptional<zod.ZodBoolean>;
            status: zod.ZodString;
            queuePosition: zod.ZodNullable<zod.ZodNumber>;
            createdAt: zod.ZodDate;
            updatedAt: zod.ZodDate;
            advancedBy: zod.ZodOptional<zod.ZodString>;
            playStartedAt: zod.ZodOptional<zod.ZodDate>;
            pausedAt: zod.ZodOptional<zod.ZodNullable<zod.ZodDate>>;
            partnerStyle: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            partnerGroupId: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            localTrackKey: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            catalogTrackId: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            isrcs: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            tempo: zod.ZodOptional<zod.ZodNullable<zod.ZodNumber>>;
            playLengthMs: zod.ZodOptional<zod.ZodNumber>;
            volumeDb: zod.ZodOptional<zod.ZodNumber>;
            migratedFrom: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_sessions": {
        readonly database: "djfeed";
        readonly name: "dj_sessions";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            ownerId: zod.ZodString;
            name: zod.ZodString;
            slug: zod.ZodOptional<zod.ZodString>;
            status: zod.ZodString;
            plugin: zod.ZodOptional<zod.ZodString>;
            startedAt: zod.ZodNullable<zod.ZodDate>;
            endsAt: zod.ZodOptional<zod.ZodNullable<zod.ZodDate>>;
            closedAt: zod.ZodNullable<zod.ZodDate>;
            partnerDancesEnabled: zod.ZodOptional<zod.ZodBoolean>;
            weightDecayEnabled: zod.ZodOptional<zod.ZodBoolean>;
            weightDecayHalfLifeMinutes: zod.ZodOptional<zod.ZodNumber>;
            tippingEnabled: zod.ZodOptional<zod.ZodBoolean>;
            autoClosedAt: zod.ZodOptional<zod.ZodDate>;
            fairnessScoringEnabled: zod.ZodOptional<zod.ZodBoolean>;
            durationMinutes: zod.ZodOptional<zod.ZodNumber>;
            queueVisibleCount: zod.ZodOptional<zod.ZodNumber>;
            feedTemplateId: zod.ZodOptional<zod.ZodString>;
            feedAppliedAt: zod.ZodOptional<zod.ZodString>;
            feedAspectRatio: zod.ZodOptional<zod.ZodString>;
            requestsEnabled: zod.ZodOptional<zod.ZodBoolean>;
            suppressedClientIds: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown>>;
            addOns: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown>>;
            migratedFrom: zod.ZodOptional<zod.ZodString>;
            shareTimeZone: zod.ZodOptional<zod.ZodString>;
            shareToken: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.dj_wallet_locks": {
        readonly database: "djfeed";
        readonly name: "dj_wallet_locks";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "djfeed.dj_wallet_transactions": {
        readonly database: "djfeed";
        readonly name: "dj_wallet_transactions";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            ownerId: zod.ZodString;
            type: zod.ZodString;
            amountCents: zod.ZodNumber;
            requestId: zod.ZodOptional<zod.ZodString>;
            attendeeId: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            createdAt: zod.ZodDate;
            stripeSessionId: zod.ZodOptional<zod.ZodString>;
            senderName: zod.ZodOptional<zod.ZodString>;
            senderEmail: zod.ZodOptional<zod.ZodString>;
            originalWalletTxId: zod.ZodOptional<zod.ZodString>;
            note: zod.ZodOptional<zod.ZodString>;
            recipientId: zod.ZodOptional<zod.ZodString>;
            recipientEmail: zod.ZodOptional<zod.ZodString>;
            beats: zod.ZodOptional<zod.ZodNumber>;
            sessionId: zod.ZodOptional<zod.ZodString>;
            durationMinutes: zod.ZodOptional<zod.ZodNumber>;
            addOns: zod.ZodOptional<zod.ZodArray<zod.ZodUnknown>>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.feed_lessons": {
        readonly database: "djfeed";
        readonly name: "feed_lessons";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            sessionId: zod.ZodString;
            hostId: zod.ZodString;
            danceId: zod.ZodString;
            startedAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.free_access": {
        readonly database: "djfeed";
        readonly name: "free_access";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            email: zod.ZodString;
            expiresAt: zod.ZodNullable<zod.ZodDate>;
            note: zod.ZodNullable<zod.ZodString>;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.host_dancers": {
        readonly database: "djfeed";
        readonly name: "host_dancers";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            hostId: zod.ZodString;
            userId: zod.ZodString;
            firstSeenAt: zod.ZodDate;
            lastSeenAt: zod.ZodDate;
            sessionCount: zod.ZodNumber;
            lastSessionId: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.lesson_checks": {
        readonly database: "djfeed";
        readonly name: "lesson_checks";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            feedLessonId: zod.ZodString;
            answer: zod.ZodEnum<{
                known: "known";
                refresh: "refresh";
                not_taken: "not_taken";
            }>;
            answeredAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.requester_history": {
        readonly database: "djfeed";
        readonly name: "requester_history";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            clientId: zod.ZodString;
            sessionId: zod.ZodString;
            ownerId: zod.ZodString;
            requesterName: zod.ZodString;
            requests: zod.ZodArray<zod.ZodObject<{
                danceName: zod.ZodString;
                danceId: zod.ZodNullable<zod.ZodString>;
                status: zod.ZodString;
                tipCents: zod.ZodNumber;
                createdAt: zod.ZodDate;
            }, zod_v4_core.$strict>>;
            sessionDate: zod.ZodDate;
            sessionName: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.session_attendance": {
        readonly database: "djfeed";
        readonly name: "session_attendance";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            sessionId: zod.ZodString;
            userId: zod.ZodString;
            firstSeenAt: zod.ZodDate;
            hostId: zod.ZodString;
            lastSeenAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.session_reports": {
        readonly database: "djfeed";
        readonly name: "session_reports";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            sessionId: zod.ZodString;
            actualDurationMs: zod.ZodNumber;
            autoClosedAt: zod.ZodNullable<zod.ZodDate>;
            closedAt: zod.ZodDate;
            endsAt: zod.ZodDate;
            extensions: zod.ZodArray<zod.ZodUnknown>;
            generatedAt: zod.ZodDate;
            ownerId: zod.ZodString;
            playedTracks: zod.ZodArray<zod.ZodObject<{
                danceName: zod.ZodString;
                danceId: zod.ZodNullable<zod.ZodString>;
                songName: zod.ZodString;
                artist: zod.ZodString;
                difficulty: zod.ZodString;
                stepsheet: zod.ZodOptional<zod.ZodString>;
                danceType: zod.ZodNullable<zod.ZodString>;
                partnerStyle: zod.ZodNullable<zod.ZodString>;
                isSongSwap: zod.ZodOptional<zod.ZodBoolean>;
                swapSongName: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                swapArtist: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
                playedAt: zod.ZodDate;
                requesters: zod.ZodArray<zod.ZodObject<{
                    clientId: zod.ZodString;
                    requesterName: zod.ZodString;
                    tipCents: zod.ZodNumber;
                }, zod_v4_core.$strict>>;
                totalTips: zod.ZodNumber;
                requesterCount: zod.ZodNumber;
                catalogTrackId: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            }, zod_v4_core.$strict>>;
            sessionName: zod.ZodString;
            startedAt: zod.ZodDate;
            stats: zod.ZodObject<{
                totalDancesPlayed: zod.ZodNumber;
                totalRequests: zod.ZodNumber;
                totalApproved: zod.ZodNumber;
                totalSkipped: zod.ZodNumber;
                totalPending: zod.ZodNumber;
                approvalRate: zod.ZodNullable<zod.ZodNumber>;
                totalTipCents: zod.ZodNumber;
                uniqueRequesters: zod.ZodNumber;
            }, zod_v4_core.$strict>;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.session_transactions": {
        readonly database: "djfeed";
        readonly name: "session_transactions";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            ownerId: zod.ZodString;
            type: zod.ZodString;
            sessionId: zod.ZodString;
            sessionName: zod.ZodString;
            durationMinutes: zod.ZodNumber;
            amountCents: zod.ZodNumber;
            stripeSessionId: zod.ZodString;
            stripePaymentIntentId: zod.ZodString;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "djfeed.stripe_events": {
        readonly database: "djfeed";
        readonly name: "stripe_events";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            type: zod.ZodString;
            receivedAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.choreographers": {
        readonly database: "ldco";
        readonly name: "choreographers";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            name: zod.ZodString;
            copperknobUrl: zod.ZodOptional<zod.ZodString>;
            lastImportedAt: zod.ZodOptional<zod.ZodString>;
            associatedUserId: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.dance_collections": {
        readonly database: "ldco";
        readonly name: "dance_collections";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            name: zod.ZodString;
            danceIds: zod.ZodArray<zod.ZodString>;
            createdBy: zod.ZodString;
            createdAt: zod.ZodNullable<zod.ZodDate>;
            updatedAt: zod.ZodNullable<zod.ZodDate>;
            isPrivate: zod.ZodOptional<zod.ZodBoolean>;
            archived: zod.ZodOptional<zod.ZodBoolean>;
            archivedAt: zod.ZodOptional<zod.ZodNullable<zod.ZodDate>>;
            isArchived: zod.ZodOptional<zod.ZodBoolean>;
            isCopyable: zod.ZodOptional<zod.ZodBoolean>;
            pendingDanceIds: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.dance_tracks": {
        readonly database: "ldco";
        readonly name: "dance_tracks";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            danceId: zod.ZodString;
            trackId: zod.ZodString;
            isPrimary: zod.ZodBoolean;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.dances": {
        readonly database: "ldco";
        readonly name: "dances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            difficulty: zod.ZodString;
            tracks: zod.ZodArray<zod.ZodString>;
            primaryTrack: zod.ZodString;
            danceName: zod.ZodString;
            choreographers: zod.ZodArray<zod.ZodString>;
            stepsheet: zod.ZodOptional<zod.ZodString>;
            stepsheetUrls: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            songArtists: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                song: zod.ZodString;
                artist: zod.ZodString;
            }, zod_v4_core.$strict>>>;
            publishedAt: zod.ZodOptional<zod.ZodDate>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.events": {
        readonly database: "ldco";
        readonly name: "events";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            venueId: zod.ZodString;
            title: zod.ZodString;
            description: zod.ZodString;
            eventDay: zod.ZodString;
            startTime: zod.ZodString;
            endTime: zod.ZodString;
            createdAt: zod.ZodDate;
            updatedAt: zod.ZodDate;
            createdBy: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.friend_requests": {
        readonly database: "ldco";
        readonly name: "friend_requests";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            requesterId: zod.ZodString;
            requesteeId: zod.ZodString;
            createdAt: zod.ZodOptional<zod.ZodDate>;
            timestamp: zod.ZodOptional<zod.ZodDate>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.instructor_venues": {
        readonly database: "ldco";
        readonly name: "instructor_venues";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            instructorId: zod.ZodString;
            venueId: zod.ZodString;
            createdAt: zod.ZodOptional<zod.ZodDate>;
            updatedAt: zod.ZodOptional<zod.ZodDate>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.instructors": {
        readonly database: "ldco";
        readonly name: "instructors";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            name: zod.ZodString;
            associatedUserId: zod.ZodOptional<zod.ZodString>;
            userId: zod.ZodOptional<zod.ZodString>;
            bio: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.lessons": {
        readonly database: "ldco";
        readonly name: "lessons";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            lessonday: zod.ZodString;
            lessonstart: zod.ZodString;
            instructors: zod.ZodArray<zod.ZodString>;
            duration: zod.ZodString;
            lessoncost: zod.ZodString;
            notes: zod.ZodString;
            difficulty: zod.ZodString;
            venueid: zod.ZodString;
            verifiedAt: zod.ZodNull;
            verifiedBy: zod.ZodNull;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.login_events": {
        readonly database: "ldco";
        readonly name: "login_events";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            userId: zod.ZodString;
            email: zod.ZodString;
            provider: zod.ZodString;
            app: zod.ZodString;
            ip: zod.ZodOptional<zod.ZodString>;
            userAgent: zod.ZodOptional<zod.ZodString>;
            createdAt: zod.ZodDate;
            clientId: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            debugReturnToCookie: zod.ZodOptional<zod.ZodNull>;
            source: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.oauth_auth_codes": {
        readonly database: "ldco";
        readonly name: "oauth_auth_codes";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "ldco.pending_dances": {
        readonly database: "ldco";
        readonly name: "pending_dances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            danceName: zod.ZodString;
            songTitle: zod.ZodString;
            artist: zod.ZodString;
            choreographer: zod.ZodString;
            count: zod.ZodNull;
            wall: zod.ZodNull;
            difficulty: zod.ZodString;
            stepsheetUrl: zod.ZodNullable<zod.ZodString>;
            submittedByUserId: zod.ZodString;
            submittedAt: zod.ZodDate;
            status: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.tracks": {
        readonly database: "ldco";
        readonly name: "tracks";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            isrc: zod.ZodOptional<zod.ZodString>;
            name: zod.ZodString;
            artists: zod.ZodArray<zod.ZodString>;
            uri: zod.ZodString;
            duration_ms: zod.ZodNumber;
            explicit: zod.ZodBoolean;
            preview_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
            is_playable: zod.ZodOptional<zod.ZodBoolean>;
            url: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_favorite_dances": {
        readonly database: "ldco";
        readonly name: "user_favorite_dances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            danceId: zod.ZodString;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_flagged_dances": {
        readonly database: "ldco";
        readonly name: "user_flagged_dances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            danceId: zod.ZodString;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_follow_collections": {
        readonly database: "ldco";
        readonly name: "user_follow_collections";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            collectionId: zod.ZodString;
            followedAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_follows": {
        readonly database: "ldco";
        readonly name: "user_follows";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            followingId: zod.ZodString;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_friends": {
        readonly database: "ldco";
        readonly name: "user_friends";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userA: zod.ZodString;
            userB: zod.ZodString;
            timestamp: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_known_dances": {
        readonly database: "ldco";
        readonly name: "user_known_dances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            danceId: zod.ZodString;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_lessons": {
        readonly database: "ldco";
        readonly name: "user_lessons";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            lessonId: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_refresh_dances": {
        readonly database: "ldco";
        readonly name: "user_refresh_dances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            danceId: zod.ZodString;
            createdAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.user_venues": {
        readonly database: "ldco";
        readonly name: "user_venues";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            venueId: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.users": {
        readonly database: "ldco";
        readonly name: "users";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            name: zod.ZodString;
            email: zod.ZodString;
            image: zod.ZodOptional<zod.ZodString>;
            emailVerified: zod.ZodOptional<zod.ZodNull>;
            bio: zod.ZodOptional<zod.ZodString>;
            favorites: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            flagged: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            known: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            refresh: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            collections: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                name: zod.ZodString;
                danceIds: zod.ZodArray<zod.ZodString>;
            }, zod_v4_core.$strict>>>;
            password: zod.ZodOptional<zod.ZodString>;
            createdAt: zod.ZodOptional<zod.ZodDate>;
            googleId: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.venue_checkins": {
        readonly database: "ldco";
        readonly name: "venue_checkins";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            venueId: zod.ZodString;
            dateKey: zod.ZodString;
            status: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.venue_users": {
        readonly database: "ldco";
        readonly name: "venue_users";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            venueId: zod.ZodString;
            requestedBy: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco.venues": {
        readonly database: "ldco";
        readonly name: "venues";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            venuename: zod.ZodString;
            venueaddress: zod.ZodString;
            geolocation: zod.ZodArray<zod.ZodNumber>;
            phone: zod.ZodString;
            website: zod.ZodString;
            timeZone: zod.ZodString;
            verifiedAt: zod.ZodNull;
            verifiedBy: zod.ZodNull;
            city: zod.ZodOptional<zod.ZodString>;
            state: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-events.event_registrations": {
        readonly database: "ldco-events";
        readonly name: "event_registrations";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            address: zod.ZodNullable<zod.ZodString>;
            agreedToWaiver: zod.ZodBoolean;
            attendeeStatus: zod.ZodOptional<zod.ZodString>;
            createdAt: zod.ZodDate;
            email: zod.ZodString;
            emails: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                templateId: zod.ZodString;
                subject: zod.ZodString;
                sentAt: zod.ZodString;
            }, zod_v4_core.$strict>>>;
            event: zod.ZodString;
            name: zod.ZodString;
            paidAt: zod.ZodOptional<zod.ZodNullable<zod.ZodDate>>;
            paymentMethod: zod.ZodString;
            paymentStatus: zod.ZodString;
            phone: zod.ZodNullable<zod.ZodString>;
            requestToken: zod.ZodString;
            waiverSignature: zod.ZodString;
            waiverSignedAt: zod.ZodString;
            requests: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                text: zod.ZodString;
                danceId: zod.ZodNullable<zod.ZodString>;
            }, zod_v4_core.$strict>>>;
            updatedAt: zod.ZodOptional<zod.ZodDate>;
            catering: zod.ZodOptional<zod.ZodBoolean>;
            stripeSessionId: zod.ZodOptional<zod.ZodNull>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-events.events": {
        readonly database: "ldco-events";
        readonly name: "events";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            slug: zod.ZodString;
            active: zod.ZodBoolean;
            createdAt: zod.ZodDate;
            date: zod.ZodString;
            dateShort: zod.ZodString;
            shortTitle: zod.ZodString;
            time: zod.ZodString;
            title: zod.ZodString;
            venueAddress: zod.ZodString;
            venueName: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-lessons.event_instructor_requests": {
        readonly database: "ldco-lessons";
        readonly name: "event_instructor_requests";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "ldco-lessons.event_instructors": {
        readonly database: "ldco-lessons";
        readonly name: "event_instructors";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            instructorId: zod.ZodString;
            eventTypeId: zod.ZodString;
            createdAt: zod.ZodDate;
            role: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-lessons.event_templates": {
        readonly database: "ldco-lessons";
        readonly name: "event_templates";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            createdAt: zod.ZodDate;
            eventTypeId: zod.ZodString;
            isDefault: zod.ZodBoolean;
            lessons: zod.ZodArray<zod.ZodObject<{
                time: zod.ZodString;
                dance: zod.ZodNullable<zod.ZodString>;
                level: zod.ZodNullable<zod.ZodString>;
                link: zod.ZodNull;
            }, zod_v4_core.$strict>>;
            name: zod.ZodString;
            updatedAt: zod.ZodDate;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-lessons.event_types": {
        readonly database: "ldco-lessons";
        readonly name: "event_types";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            createdAt: zod.ZodDate;
            createdBy: zod.ZodString;
            defaultDurationMinutes: zod.ZodNumber;
            defaultStartTime: zod.ZodNullable<zod.ZodString>;
            isActive: zod.ZodBoolean;
            level: zod.ZodString;
            price: zod.ZodString;
            title: zod.ZodString;
            updatedAt: zod.ZodDate;
            venueId: zod.ZodString;
            verifiedAt: zod.ZodNull;
            verifiedBy: zod.ZodNull;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-lessons.events": {
        readonly database: "ldco-lessons";
        readonly name: "events";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            cancelNote: zod.ZodNullable<zod.ZodString>;
            createdAt: zod.ZodDate;
            date: zod.ZodString;
            endAt: zod.ZodDate;
            eventTypeId: zod.ZodString;
            isCancelled: zod.ZodBoolean;
            lessons: zod.ZodArray<zod.ZodObject<{
                _id: zod.ZodString;
                startAt: zod.ZodDate;
                dance: zod.ZodNullable<zod.ZodString>;
                danceId: zod.ZodNullable<zod.ZodString>;
                level: zod.ZodNullable<zod.ZodString>;
                link: zod.ZodNullable<zod.ZodString>;
                committed: zod.ZodBoolean;
                skipped: zod.ZodBoolean;
            }, zod_v4_core.$strict>>;
            specialNote: zod.ZodNullable<zod.ZodString>;
            startAt: zod.ZodDate;
            substitute: zod.ZodNullable<zod.ZodString>;
            substituteInstructorId: zod.ZodNull;
            timeZone: zod.ZodString;
            updatedAt: zod.ZodDate;
            verifiedAt: zod.ZodNull;
            verifiedBy: zod.ZodNull;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-lessons.frequencies": {
        readonly database: "ldco-lessons";
        readonly name: "frequencies";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            byDay: zod.ZodOptional<zod.ZodArray<zod.ZodString>>;
            createdAt: zod.ZodDate;
            durationMinutes: zod.ZodNumber;
            eventTypeId: zod.ZodString;
            isActive: zod.ZodOptional<zod.ZodBoolean>;
            kind: zod.ZodString;
            startDate: zod.ZodOptional<zod.ZodString>;
            startTime: zod.ZodString;
            updatedAt: zod.ZodDate;
            endDate: zod.ZodOptional<zod.ZodString>;
            nth: zod.ZodOptional<zod.ZodNumber>;
            weekday: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-lessons.lessons": {
        readonly database: "ldco-lessons";
        readonly name: "lessons";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            danceId: zod.ZodOptional<zod.ZodString>;
            date: zod.ZodDate;
            eventId: zod.ZodNullable<zod.ZodString>;
            instructorId: zod.ZodString;
            lessonId: zod.ZodNull;
            venue: zod.ZodString;
            venueId: zod.ZodString;
            danceName: zod.ZodOptional<zod.ZodString>;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-reviews.choreographers": {
        readonly database: "ldco-reviews";
        readonly name: "choreographers";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "ldco-reviews.dances": {
        readonly database: "ldco-reviews";
        readonly name: "dances";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "ldco-reviews.join_choreographer_appeals": {
        readonly database: "ldco-reviews";
        readonly name: "join_choreographer_appeals";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "ldco-reviews.lessons": {
        readonly database: "ldco-reviews";
        readonly name: "lessons";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            lessonday: zod.ZodString;
            lessonstart: zod.ZodString;
            instructors: zod.ZodArray<zod.ZodString>;
            duration: zod.ZodString;
            lessoncost: zod.ZodString;
            notes: zod.ZodString;
            difficulty: zod.ZodString;
            venueid: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-reviews.reports": {
        readonly database: "ldco-reviews";
        readonly name: "reports";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "ldco-reviews.tracks": {
        readonly database: "ldco-reviews";
        readonly name: "tracks";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodUnion<readonly [zod.ZodString, zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>]>;
        }, zod_v4_core.$loose>;
    };
    readonly "ldco-reviews.venue_users": {
        readonly database: "ldco-reviews";
        readonly name: "venue_users";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            userId: zod.ZodString;
            venueId: zod.ZodString;
            createdAt: zod.ZodDate;
            requestedBy: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-reviews.venues": {
        readonly database: "ldco-reviews";
        readonly name: "venues";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            venuename: zod.ZodString;
            venueaddress: zod.ZodString;
            geolocation: zod.ZodArray<zod.ZodNumber>;
            phone: zod.ZodString;
            website: zod.ZodString;
            contactName: zod.ZodString;
            contactEmail: zod.ZodString;
            contactPhone: zod.ZodString;
            createdAt: zod.ZodDate;
            timeZone: zod.ZodString;
            verifiedAt: zod.ZodNull;
            verifiedBy: zod.ZodNull;
        }, zod_v4_core.$strict>;
    };
    readonly "ldco-reviews.verify_user_instructor": {
        readonly database: "ldco-reviews";
        readonly name: "verify_user_instructor";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodCustom<{
                toHexString(): string;
            }, {
                toHexString(): string;
            }>;
            userId: zod.ZodString;
            instructorId: zod.ZodString;
            createdAt: zod.ZodDate;
            resolved: zod.ZodBoolean;
            resolution: zod.ZodString;
            resolvedAt: zod.ZodDate;
            resolvedBy: zod.ZodString;
        }, zod_v4_core.$strict>;
    };
    readonly "music_catalog.tracks": {
        readonly database: "music_catalog";
        readonly name: "tracks";
        readonly schema: zod.ZodObject<{
            _id: zod.ZodString;
            artist: zod.ZodString;
            createdAt: zod.ZodDate;
            disambiguation: zod.ZodString;
            durationMs: zod.ZodNullable<zod.ZodNumber>;
            isrcs: zod.ZodArray<zod.ZodString>;
            nArtist: zod.ZodString;
            nTitle: zod.ZodString;
            rank: zod.ZodNumber;
            rankedAt: zod.ZodOptional<zod.ZodDate>;
            source: zod.ZodString;
            sourceId: zod.ZodString;
            title: zod.ZodString;
            updatedAt: zod.ZodDate;
            variantKey: zod.ZodString;
            words: zod.ZodArray<zod.ZodString>;
            year: zod.ZodNullable<zod.ZodNumber>;
        }, zod_v4_core.$strict>;
    };
};

type Scope = string[];
declare function inScope(key: string, scope: Scope): boolean;
/** Scope entries that match none of the given collection keys (usually a typo or a removed collection). */
declare function unmatchedEntries(scope: Scope, keys: string[]): string[];
/** Reads "ldco.uses" from a parsed package.json; undefined when the app declares no scope. */
declare function scopeFromPackageJson(pkg: unknown): Scope | undefined;

declare const CONTRACT_VERSION: string;
declare function computeContractHash(): string;
declare function computeCollectionHashes(): Record<string, string>;
declare const CONTRACT_HASH: string;
/** Locked hash of each collection, keyed "<database>.<collection>". */
declare const COLLECTION_HASHES: Record<string, string>;

export { type BldEventTemplates, BldEventTemplatesSchema, type BldEventTypes, BldEventTypesSchema, type BldEvents, BldEventsSchema, type BldFrequencies, BldFrequenciesSchema, type BldLessons, BldLessonsSchema, COLLECTION_HASHES, CONTRACT_HASH, CONTRACT_VERSION, type CopperknobAlertProcessedItems, CopperknobAlertProcessedItemsSchema, type CopperknobAlertSyncMetadata, CopperknobAlertSyncMetadataSchema, type CopperknobAlertWatchRules, CopperknobAlertWatchRulesSchema, type DjfeedAttendeeNotifications, DjfeedAttendeeNotificationsSchema, type DjfeedBeatBalances, DjfeedBeatBalancesSchema, type DjfeedBeatTransactions, DjfeedBeatTransactionsSchema, type DjfeedDancerFavoriteSongs, DjfeedDancerFavoriteSongsSchema, type DjfeedDjDirectMessages, DjfeedDjDirectMessagesSchema, type DjfeedDjMessages, DjfeedDjMessagesSchema, type DjfeedDjNotifications, DjfeedDjNotificationsSchema, type DjfeedDjProfiles, DjfeedDjProfilesSchema, type DjfeedDjRequesterNicknames, DjfeedDjRequesterNicknamesSchema, type DjfeedDjRequests, DjfeedDjRequestsSchema, type DjfeedDjSessions, DjfeedDjSessionsSchema, type DjfeedDjWalletLocks, DjfeedDjWalletLocksSchema, type DjfeedDjWalletTransactions, DjfeedDjWalletTransactionsSchema, type DjfeedFeedLessons, DjfeedFeedLessonsSchema, type DjfeedFreeAccess, DjfeedFreeAccessSchema, type DjfeedHostDancers, DjfeedHostDancersSchema, type DjfeedLessonChecks, DjfeedLessonChecksSchema, type DjfeedRequesterHistory, DjfeedRequesterHistorySchema, type DjfeedSessionAttendance, DjfeedSessionAttendanceSchema, type DjfeedSessionReports, DjfeedSessionReportsSchema, type DjfeedSessionTransactions, DjfeedSessionTransactionsSchema, type DjfeedStripeEvents, DjfeedStripeEventsSchema, type LdcoChoreographers, LdcoChoreographersSchema, type LdcoDanceCollections, LdcoDanceCollectionsSchema, type LdcoDanceTracks, LdcoDanceTracksSchema, type LdcoDances, LdcoDancesSchema, type LdcoEvents, type LdcoEventsEventRegistrations, LdcoEventsEventRegistrationsSchema, type LdcoEventsEvents, LdcoEventsEventsSchema, LdcoEventsSchema, type LdcoFriendRequests, LdcoFriendRequestsSchema, type LdcoInstructorVenues, LdcoInstructorVenuesSchema, type LdcoInstructors, LdcoInstructorsSchema, type LdcoLessons, type LdcoLessonsEventInstructorRequests, LdcoLessonsEventInstructorRequestsSchema, type LdcoLessonsEventInstructors, LdcoLessonsEventInstructorsSchema, type LdcoLessonsEventTemplates, LdcoLessonsEventTemplatesSchema, type LdcoLessonsEventTypes, LdcoLessonsEventTypesSchema, type LdcoLessonsEvents, LdcoLessonsEventsSchema, type LdcoLessonsFrequencies, LdcoLessonsFrequenciesSchema, type LdcoLessonsLessons, LdcoLessonsLessonsSchema, LdcoLessonsSchema, type LdcoLoginEvents, LdcoLoginEventsSchema, type LdcoOauthAuthCodes, LdcoOauthAuthCodesSchema, type LdcoPendingDances, LdcoPendingDancesSchema, type LdcoReviewsChoreographers, LdcoReviewsChoreographersSchema, type LdcoReviewsDances, LdcoReviewsDancesSchema, type LdcoReviewsJoinChoreographerAppeals, LdcoReviewsJoinChoreographerAppealsSchema, type LdcoReviewsLessons, LdcoReviewsLessonsSchema, type LdcoReviewsReports, LdcoReviewsReportsSchema, type LdcoReviewsTracks, LdcoReviewsTracksSchema, type LdcoReviewsVenueUsers, LdcoReviewsVenueUsersSchema, type LdcoReviewsVenues, LdcoReviewsVenuesSchema, type LdcoReviewsVerifyUserInstructor, LdcoReviewsVerifyUserInstructorSchema, type LdcoTracks, LdcoTracksSchema, type LdcoUserFavoriteDances, LdcoUserFavoriteDancesSchema, type LdcoUserFlaggedDances, LdcoUserFlaggedDancesSchema, type LdcoUserFollowCollections, LdcoUserFollowCollectionsSchema, type LdcoUserFollows, LdcoUserFollowsSchema, type LdcoUserFriends, LdcoUserFriendsSchema, type LdcoUserKnownDances, LdcoUserKnownDancesSchema, type LdcoUserLessons, LdcoUserLessonsSchema, type LdcoUserRefreshDances, LdcoUserRefreshDancesSchema, type LdcoUserVenues, LdcoUserVenuesSchema, type LdcoUsers, LdcoUsersSchema, type LdcoVenueCheckins, LdcoVenueCheckinsSchema, type LdcoVenueUsers, LdcoVenueUsersSchema, type LdcoVenues, LdcoVenuesSchema, type MusicCatalogTracks, MusicCatalogTracksSchema, type Scope, collections, computeCollectionHashes, computeContractHash, inScope, scopeFromPackageJson, unmatchedEntries };
