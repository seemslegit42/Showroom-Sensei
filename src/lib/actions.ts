
'use server';

import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, getDoc, writeBatch } from 'firebase/firestore';
import type { VisitStage, VisitWithVisitor, InventoryModel, Visitor } from './types';
import { revalidatePath } from 'next/cache';
import type { VisitorIntakeForm } from './validators';

/**
 * Creates a new visitor and an associated visit record in the database.
 * @param visitorData - The data for the new visitor and visit, validated against the Zod schema.
 * @returns The newly created visit record with its Firestore ID.
 */
export async function createVisitorAndVisit(visitorData: VisitorIntakeForm) {
    const hostUserEmail = 'sarah@example.com'; 

    const newVisitor = {
        name: visitorData.name,
    };
    
    const visitorRef = await addDoc(collection(db, "visitors"), newVisitor);

    let budgetMin = 0;
    let budgetMax: number | null = null;
    if (visitorData.budget) {
        if (visitorData.budget.startsWith('<')) {
            budgetMin = 0;
            budgetMax = parseInt(visitorData.budget.replace(/\D/g, ''), 10) * 1000;
        } else if (visitorData.budget.startsWith('>')) {
            budgetMin = parseInt(visitorData.budget.replace(/\D/g, ''), 10) * 1000;
            budgetMax = null;
        } else if (visitorData.budget.includes('-')) {
            const parts = visitorData.budget.split('-').map(p => parseInt(p.replace(/\D/g, ''), 10) * 1000);
            budgetMin = parts[0];
            budgetMax = parts[1];
        }
    }

    const newVisit = {
        visitorId: visitorRef.id,
        hostUserEmail: hostUserEmail, // Simplification
        stage: visitorData.status,
        timeline: visitorData.timeline,
        mustHave: visitorData.mustHave,
        budgetMin,
        budgetMax,
        startedAt: Timestamp.now(),
        endedAt: null,
    };
    
    const visitRef = await addDoc(collection(db, "visits"), newVisit);

    revalidatePath('/dashboard');

    return { id: visitRef.id, ...newVisit};
}

/**
 * Fetches all currently active (non-ended) visits.
 * @returns A promise that resolves to an array of active visits with visitor and host details.
 */
export async function getActiveVisits(): Promise<VisitWithVisitor[]> {
    const q = query(collection(db, "visits"), where("endedAt", "==", null));
    const querySnapshot = await getDocs(q);

    const visits: VisitWithVisitor[] = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
            const visitData = docSnapshot.data();
            const visitorDoc = await getDoc(doc(db, "visitors", visitData.visitorId));
            
            return {
                id: docSnapshot.id,
                ...visitData,
                visitor: { id: visitorDoc.id, ...visitorDoc.data() } as Visitor,
                host: { name: visitData.hostUserEmail.split('@')[0] }, // Simplified host representation
                startedAt: (visitData.startedAt as Timestamp).toDate(),
                endedAt: null,
            } as VisitWithVisitor;
        })
    );

    return visits.sort((a,b) => b.startedAt.getTime() - a.startedAt.getTime());
}

/**
 * Fetches the details for a single visit by its ID.
 * @param visitId - The ID of the visit to fetch.
 * @returns A promise that resolves to the visit details, or null if not found.
 */
export async function getVisitDetails(visitId: string): Promise<VisitWithVisitor | null> {
    const visitDocRef = doc(db, "visits", visitId);
    const visitDoc = await getDoc(visitDocRef);

    if (!visitDoc.exists()) {
        return null;
    }

    const visitData = visitDoc.data();
    const visitorDoc = await getDoc(doc(db, "visitors", visitData.visitorId));

     if (!visitorDoc.exists()) {
        return null;
    }

    return {
        id: visitDoc.id,
        ...visitData,
        visitor: { id: visitorDoc.id, ...visitorDoc.data() } as Visitor,
        host: { name: visitData.hostUserEmail.split('@')[0] }, // Simplified host representation
        startedAt: (visitData.startedAt as Timestamp).toDate(),
        endedAt: visitData.endedAt ? (visitData.endedAt as Timestamp).toDate() : null,
    } as VisitWithVisitor;
}

/**
 * Fetches all inventory models from the database.
 * @returns A promise that resolves to an array of inventory models.
 */
export async function getInventory(): Promise<InventoryModel[]> {
    const querySnapshot = await getDocs(collection(db, "inventoryModels"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryModel));
}

/**
 * Fetches aggregated analytics data from the database.
 * @returns A promise that resolves to an object containing all visits, lead score data, and objection data.
 */
export async function getAnalyticsData() {
    const querySnapshot = await getDocs(collection(db, "visits"));

    const allVisits: VisitWithVisitor[] = await Promise.all(
         querySnapshot.docs.map(async (docSnapshot) => {
            const visitData = docSnapshot.data();
            const visitorDoc = await getDoc(doc(db, "visitors", visitData.visitorId));
            
            return {
                id: docSnapshot.id,
                ...visitData,
                visitor: { id: visitorDoc.id, ...visitorDoc.data() } as Visitor,
                host: { name: visitData.hostUserEmail.split('@')[0] }, // Simplified host representation
                startedAt: (visitData.startedAt as Timestamp).toDate(),
            } as VisitWithVisitor;
        })
    );


    const leadScoreData = allVisits.reduce((acc, visit) => {
        const stage = visit.stage || 'Researching';
        const existing = acc.find(item => item.name === stage);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: stage, value: 1 });
        }
        return acc;
    }, [] as { name: VisitStage, value: number }[]);

    // Ensure all stages are present in the data, even if they have a value of 0
    const allStages: VisitStage[] = ['Hot Now', 'Researching', 'Just Looking'];
    allStages.forEach(stage => {
        if (!leadScoreData.find(item => item.name === stage)) {
            leadScoreData.push({ name: stage, value: 0 });
        }
    });

    const objectionData = [
        { name: 'Price', value: 12 },
        { name: 'Timeline', value: 8 },
        { name: 'Lot Size', value: 5 },
        { name: 'Finishes', value: 3 },
        { name: 'Location', value: 2 },
    ];

    return { allVisits, leadScoreData, objectionData };
}

/**
 * A temporary utility function to seed the database with sample data.
 */
export async function seedDatabase() {
    console.log("Seeding Firestore...");
    const batch = writeBatch(db);

    // This is a simplified "clear" for a demo. In a real app, you'd use a more robust method.
    console.log("Skipping data clearing for this demo to avoid complex deletion logic.");

    // Seed Inventory
    const inventoryData = [
        { name: 'The Aspen', basePrice: '450000', beds: '3', baths: '2.5', sqft: 2000, garage: 2, active: true },
        { name: 'The Birch', basePrice: '520000', beds: '4', baths: '3.5', sqft: 2400, garage: 2, active: true },
        { name: 'The Cedar', basePrice: '610000', beds: '4', baths: '3.5', sqft: 2800, garage: 3, active: true },
        { name: 'The Dogwood', basePrice: '750000', beds: '5', baths: '4.5', sqft: 3200, garage: 3, active: true },
    ];
    inventoryData.forEach(item => {
        const docRef = doc(collection(db, "inventoryModels"));
        batch.set(docRef, item);
    });
    console.log("Inventory queued for seeding.");

    // Seed Visitors and Visits
    const visitorsData = [
        { name: 'The Miller Family', email: 'miller@test.com', phone: '555-1234' },
        { name: 'Jane & John Smith', email: 'smith@test.com', phone: '555-5678' },
        { name: 'Dr. Evelyn Reed', email: 'reed@test.com', phone: '555-9012' },
        { name: 'The Garcia Household', email: 'garcia@test.com', phone: '555-3456' },
    ];

    const visitsData = [
        { stage: 'Hot Now', budgetMin: 650000, budgetMax: 750000, mustHave: 'A large backyard for their dog, Buster.', timeline: '3-6' },
        { stage: 'Researching', budgetMin: 500000, budgetMax: 550000, mustHave: 'Open concept kitchen for entertaining.', timeline: '6-12' },
        { stage: 'Just Looking', budgetMin: 800000, budgetMax: null, mustHave: 'A quiet home office with lots of natural light.', timeline: '>12' },
        { stage: 'Hot Now', budgetMin: 400000, budgetMax: 450000, mustHave: 'At least 3 bedrooms on the same floor for the kids.', timeline: '<3' },
    ];
    
    visitorsData.forEach((visitor, index) => {
        const visitorRef = doc(collection(db, "visitors"));
        batch.set(visitorRef, visitor);
        
        const visitRef = doc(collection(db, "visits"));
        batch.set(visitRef, {
            ...visitsData[index],
            visitorId: visitorRef.id,
            hostUserEmail: 'sarah@example.com',
            startedAt: Timestamp.now(),
            endedAt: null
        });
    });
    console.log("Visitors and Visits queued for seeding.");
    
    await batch.commit();
    console.log("Firestore seeding complete.");
    
    revalidatePath('/dashboard');
}
