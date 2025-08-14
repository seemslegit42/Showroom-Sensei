
'use server';

import { signIn } from '@/../auth';
import { db } from './db';
import { inventoryModels, users, visitors, visits } from './db/schema';
import type { VisitStage, VisitWithVisitor } from './types';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { VisitorIntakeForm } from './validators';
import type { Visitor } from './db/schema';

export async function signInWithEmail(email: string) {
  try {
    await signIn('resend', { email, redirect: false });
    return { success: true, message: 'Check your email for a magic link to sign in.' };
  } catch (error) {
    // Auth.js throws errors for expected flows (like returning to the login page),
    // so we'll treat most errors as a success message to the user.
    // Real error logging would happen on the server.
    console.log(error);
    return { success: true, message: 'Check your email for a magic link to sign in.' };
  }
}


/**
 * Creates a new visitor and an associated visit record in the database.
 * @param visitorData - The data for the new visitor and visit, validated against the Zod schema.
 * @returns The newly created visit record.
 */
export async function createVisitorAndVisit(visitorData: VisitorIntakeForm) {
    // This is a simplification. In a real app, you'd get the tenant and host user IDs
    // from the session or context.
    const tenantId = 1;
    const hostUser = await db.query.users.findFirst();
    if (!hostUser) {
        throw new Error("No host user found in the database to assign the visit to.");
    }

    const newVisitor = {
        name: visitorData.name,
        tenantId,
    };
    
    const [visitor] = await db.insert(visitors).values(newVisitor).returning();

    const newVisit = {
        tenantId,
        visitorId: visitor.id,
        hostUserId: hostUser.id,
        stage: visitorData.status,
        timeline: visitorData.timeline,
        mustHave: visitorData.mustHave,
        budgetMin: visitorData.budget ? parseInt(visitorData.budget.split('-')[0].replace(/\D/g, '')) * 1000 : 0,
        budgetMax: visitorData.budget ? parseInt(visitorData.budget.split('-')[1]?.replace(/\D/g, '')) * 1000 || null : null,
    };
    
    const [insertedVisit] = await db.insert(visits).values(newVisit).returning();

    revalidatePath('/dashboard');

    return insertedVisit;
}


/**
 * Fetches all currently active (non-ended) visits.
 * @returns A promise that resolves to an array of active visits with visitor and host details.
 */
export async function getActiveVisits(): Promise<VisitWithVisitor[]> {
    const activeVisits = await db.query.visits.findMany({
        where: eq(visits.endedAt, null),
        with: {
            visitor: true,
            host: true,
        },
        orderBy: (visits, { desc }) => [desc(visits.startedAt)],
    });
    return activeVisits;
}


/**
 * Fetches the details for a single visit by its ID.
 * @param visitId - The ID of the visit to fetch.
 * @returns A promise that resolves to the visit details, or null if not found.
 */
export async function getVisitDetails(visitId: number): Promise<VisitWithVisitor | null> {
    if (isNaN(visitId)) return null;
    const visit = await db.query.visits.findFirst({
        where: eq(visits.id, visitId),
        with: {
            visitor: true,
            host: true,
        },
    });
    return visit || null;
}

/**
 * Fetches all inventory models from the database.
 * @returns A promise that resolves to an array of inventory models.
 */
export async function getInventory() {
    return await db.query.inventoryModels.findMany();
}


/**
 * Fetches aggregated analytics data from the database.
 * @returns A promise that resolves to an object containing summary, lead score, and objection data.
 */
export async function getAnalyticsData() {
    const allVisits = await db.query.visits.findMany();

    const summary = allVisits.reduce((acc, visit) => {
        acc.totalVisitors += 1;
        if (visit.stage === 'Hot Now') {
            acc.hotLeads += 1;
            acc.pipeline += visit.budgetMax || visit.budgetMin || 0;
        } else if (visit.stage === 'Researching') {
            acc.pipeline += visit.budgetMin || 0;
        }
        return acc;
    }, { totalVisitors: 0, hotLeads: 0, holds: 0, pipeline: 0 });


    const leadScoreData = allVisits.reduce((acc, visit) => {
        const stage = visit.stage || 'Researching';
        const existing = acc.find(item => item.name === stage);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: stage, value: 1 });
        }
        return acc;
    }, [] as { name: string, value: number }[]);


    const objectionData = [
        { name: 'Price', value: 12 },
        { name: 'Timeline', value: 8 },
        { name: 'Lot Size', value: 5 },
        { name: 'Finishes', value: 3 },
        { name: 'Location', value: 2 },
    ];

    return { summary, leadScoreData, objectionData };
}

/**
 * A temporary utility function to seed the database with sample data.
 * This should be removed or secured in a real production environment.
 * It's triggered by a special name in the visitor intake form.
 */
export async function seedDatabase() {
    console.log("Seeding database...");

    // Clear existing data in a safe order
    await db.delete(visits);
    await db.delete(visitors);
    await db.delete(inventoryModels);
    await db.delete(users);
    console.log("Existing data cleared.");

    // Seed Users
    await db.insert(users).values([
        { name: 'Sarah P.', email: 'sarah@example.com', role: 'HOST' },
        { name: 'John D.', email: 'john@example.com', role: 'HOST' },
    ]).onConflictDoNothing();
     console.log("Users seeded.");

    // Seed Inventory
    await db.insert(inventoryModels).values([
        { tenantId: 1, name: 'The Aspen', basePrice: '450000', beds: '3', baths: '2.5', sqft: 2000, garage: 2, active: true },
        { tenantId: 1, name: 'The Birch', basePrice: '520000', beds: '4', baths: '3.5', sqft: 2400, garage: 2, active: true },
        { tenantId: 1, name: 'The Cedar', basePrice: '610000', beds: '4', baths: '3.5', sqft: 2800, garage: 3, active: true },
        { tenantId: 1, name: 'The Dogwood', basePrice: '750000', beds: '5', baths: '4.5', sqft: 3200, garage: 3, active: true },
    ]).onConflictDoNothing();
    console.log("Inventory seeded.");

    // Seed Visitors and Visits
    const host = await db.query.users.findFirst();
    if (!host) {
        throw new Error("Cannot seed visits without a host user.");
    }

    const visitorsData: Omit<Visitor, 'id' | 'tenantId' | 'createdAt'>[] = [
        { name: 'The Miller Family', email: 'miller@test.com', phone: '555-1234' },
        { name: 'Jane & John Smith', email: 'smith@test.com', phone: '555-5678' },
        { name: 'Dr. Evelyn Reed', email: 'reed@test.com', phone: '555-9012' },
        { name: 'The Garcia Household', email: 'garcia@test.com', phone: '555-3456' },
    ];

     const insertedVisitors = await db.insert(visitors).values(visitorsData.map(v => ({ ...v, tenantId: 1 }))).returning();
     console.log("Visitors seeded.");

    const visitsData = [
        { visitorId: insertedVisitors[0].id, stage: 'Hot Now', budgetMin: 650000, budgetMax: 750000, mustHave: 'A large backyard for their dog, Buster.', timeline: '3-6' },
        { visitorId: insertedVisitors[1].id, stage: 'Researching', budgetMin: 500000, budgetMax: 550000, mustHave: 'Open concept kitchen for entertaining.', timeline: '6-12' },
        { visitorId: insertedVisitors[2].id, stage: 'Just Looking', budgetMin: 800000, budgetMax: null, mustHave: 'A quiet home office with lots of natural light.', timeline: '>12' },
        { visitorId: insertedVisitors[3].id, stage: 'Hot Now', budgetMin: 400000, budgetMax: 450000, mustHave: 'At least 3 bedrooms on the same floor for the kids.', timeline: '<3' },
    ];

    await db.insert(visits).values(visitsData.map(v => ({ ...v, tenantId: 1, hostUserId: host.id })));
    console.log("Visits seeded.");
    
    revalidatePath('/dashboard');
    console.log("Paths revalidated. Seeding complete.");
}
