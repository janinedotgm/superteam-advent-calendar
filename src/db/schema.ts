import { pgTable, text, timestamp, boolean, integer, serial, date, unique, uuid } from 'drizzle-orm/pg-core';

export const mints = pgTable('mints', {
  id: text('id').primaryKey(),
  walletAddress: text('wallet_address').notNull(),
  doorNumber: integer('door_number').notNull(),
  mintedAt: timestamp('minted_at').defaultNow().notNull(),
  nftAddress: text('nft_address').notNull(),
  isEligibleForRaffle: boolean('is_eligible_for_raffle').default(true).notNull(),
}, (table) => ({
  uniqWalletDoor: unique('uniq_wallet_door').on(table.walletAddress, table.doorNumber),
}));

export const registrations = pgTable('registrations', {
  walletAddress: text('wallet_address').primaryKey(),
  registrationDate: timestamp('registration_date').defaultNow(),
  registrationTx: text('registration_tx'),
  isActive: boolean('is_active').default(true)
});

export const prizes = pgTable('prizes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  doorNumber: integer('door_number').notNull(),
  quantity: integer('quantity').notNull(),
  winnerMessage: text('winner_message'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const prizeWinners = pgTable('prize_winners', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: text('wallet_address').references(() => registrations.walletAddress),
  doorNumber: integer('door_number'),
  dayDate: date('day_date'),
  prizeId: uuid('prize_id').references(() => prizes.id),
  claimed: boolean('claimed').default(false),
}); 