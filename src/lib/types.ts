
export type VisitWithVisitor = {
    id: string;
    visitor: Visitor;
    host: { name: string | null } | null;
    visitorId: string;
    hostUserEmail: string;
    stage: VisitStage;
    budgetMin: number;
    budgetMax: number | null;
    timeline: string;
    mustHave: string;
    notes: string | null;
    startedAt: Date;
    endedAt: Date | null;
};

export type Visitor = {
    id: string;
    name: string | null;
    email?: string | null;
    phone?: string | null;
}

export type InventoryModel = {
    id: string;
    name: string;
    basePrice: string;
    beds: string;
    baths: string;
    sqft: number;
    garage: number;
    active: boolean;
};

export type VisitStage = "Just Looking" | "Researching" | "Hot Now";
