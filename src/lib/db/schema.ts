import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  pgEnum,
  boolean,
  decimal,
  json,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const roles = pgEnum('roles', ['HOST', 'MANAGER', 'ADMIN']);
export const channels = pgEnum('channels', ['EMAIL', 'SMS']);
export const visitStages = pgEnum('visit_stages', ['JUST_LOOKING', 'RESEARCHING', 'HOT']);
export const lotStatuses = pgEnum('lot_statuses', ['AVAILABLE', 'HOLD', 'SOLD']);
export const wishlistItemTypes = pgEnum('wishlist_item_types', ['MODEL', 'OPTION', 'LOT']);
export const followupStatuses = pgEnum('followup_statuses', ['QUEUED', 'SENT', 'FAILED']);
export const actorTypes = pgEnum('actor_types', ['USER', 'SYSTEM', 'VISITOR']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: roles('role').default('HOST'),
  pinHash: text('pinHash'),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const tenants = pgTable('tenant', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').unique(),
});

export const userTenants = pgTable(
  'user_tenant',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tenantId: integer('tenantId')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    role: roles('role').notNull(),
  },
  (ut) => ({
    compoundKey: primaryKey({ columns: [ut.userId, ut.tenantId] }),
  })
);

export const inventoryModels = pgTable('inventory_model', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenantId')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  basePrice: decimal('basePrice', { precision: 12, scale: 2 }).notNull(),
  beds: decimal('beds', { precision: 3, scale: 1 }).notNull(),
  baths: decimal('baths', { precision: 3, scale: 1 }).notNull(),
  sqft: integer('sqft').notNull(),
  garage: integer('garage'),
  active: boolean('active').default(true),
});

export const lots = pgTable('lot', {
    id: serial('id').primaryKey(),
    tenantId: integer('tenantId').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    community: text('community').notNull(),
    facing: text('facing'),
    priceAdj: decimal('priceAdj', { precision: 12, scale: 2 }).default('0'),
    status: lotStatuses('status').default('AVAILABLE'),
});

export const options = pgTable('option', {
    id: serial('id').primaryKey(),
    tenantId: integer('tenantId').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    category: text('category'),
    priceBandLow: decimal('priceBandLow', { precision: 12, scale: 2 }),
    priceBandHigh: decimal('priceBandHigh', { precision: 12, scale: 2 }),
});

export const visitors = pgTable('visitor', {
    id: serial('id').primaryKey(),
    tenantId: integer('tenantId').references(() => tenants.id),
    firstName: text('firstName'),
    lastName: text('lastName'),
    email: text('email'),
    phone: text('phone'),
});

export const consentLogs = pgTable('consent_log', {
    id: serial('id').primaryKey(),
    visitorId: integer('visitorId').notNull().references(() => visitors.id, { onDelete: 'cascade' }),
    channel: channels('channel').notNull(),
    optedIn: boolean('optedIn').notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).defaultNow(),
    ip: text('ip'),
    userAgent: text('userAgent'),
    source: text('source'),
});

export const visits = pgTable('visit', {
    id: serial('id').primaryKey(),
    tenantId: integer('tenantId').notNull().references(() => tenants.id),
    visitorId: integer('visitorId').notNull().references(() => visitors.id),
    hostUserId: text('hostUserId').references(() => users.id),
    stage: visitStages('stage'),
    budgetMin: integer('budgetMin'),
    budgetMax: integer('budgetMax'),
    timeline: text('timeline'),
    mustHave: text('mustHave'),
    notes: text('notes'),
    startedAt: timestamp('startedAt', { withTimezone: true, mode: 'date' }).defaultNow(),
    endedAt: timestamp('endedAt', { withTimezone: true, mode: 'date' }),
});

export const visitPhotos = pgTable('visit_photo', {
    id: serial('id').primaryKey(),
    visitId: integer('visitId').notNull().references(() => visits.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    caption: text('caption'),
});

export const wishlistItems = pgTable('wishlist_item', {
    id: serial('id').primaryKey(),
    visitId: integer('visitId').notNull().references(() => visits.id, { onDelete: 'cascade' }),
    itemType: wishlistItemTypes('itemType'),
    refId: integer('refId'),
    qty: integer('qty'),
});

export const followUps = pgTable('follow_up', {
    id: serial('id').primaryKey(),
    visitId: integer('visitId').notNull().references(() => visits.id, { onDelete: 'cascade' }),
    channel: channels('channel'),
    status: followupStatuses('status'),
    sentAt: timestamp('sentAt', { withTimezone: true, mode: 'date' }),
    templateId: text('templateId'),
    personalizationJson: json('personalizationJson'),
});

export const leadScores = pgTable('lead_score', {
    id: serial('id').primaryKey(),
    visitId: integer('visitId').notNull().references(() => visits.id, { onDelete: 'cascade' }),
    score: integer('score'),
    factorsJson: json('factorsJson'),
    updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const objectionLogs = pgTable('objection_log', {
    id: serial('id').primaryKey(),
    visitId: integer('visitId').notNull().references(() => visits.id, { onDelete: 'cascade' }),
    text: text('text'),
    category: text('category'),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const eventLogs = pgTable('event_log', {
    id: serial('id').primaryKey(),
    tenantId: integer('tenantId').references(() => tenants.id),
    actorType: actorTypes('actorType'),
    actorId: text('actorId'),
    type: text('type'),
    payloadJson: json('payloadJson'),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).defaultNow(),
});
