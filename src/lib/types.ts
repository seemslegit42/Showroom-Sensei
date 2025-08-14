
import type { User, Visitor, Visit, InventoryModel as DbInventoryModel } from './db/schema';

export type VisitWithVisitor = Visit & {
    visitor: Visitor;
    host: User | null;
};

export type InventoryModel = DbInventoryModel;

export type VisitStage = 'Hot Now' | 'Researching' | 'Just Looking';
