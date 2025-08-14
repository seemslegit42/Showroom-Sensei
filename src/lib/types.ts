
import type { User, Visitor, Visit, InventoryModel as DbInventoryModel, visitStages } from './db/schema';

export type VisitWithVisitor = Visit & {
    visitor: Visitor;
    host: User | null;
};

export type InventoryModel = DbInventoryModel;

export type VisitStage = (typeof visitStages.enumValues)[number];
