import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { pets, petStatusEnum } from '../db/schema/pets';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Pet = InferSelectModel<typeof pets>;
export type NewPet = InferInsertModel<typeof pets>;

export class PetService {
    async findAllByUserId(userId: string): Promise<Pet[]> {
        return db.select().from(pets).where(eq(pets.userId, userId));
    }

    async findById(id: string): Promise<Pet | undefined> {
        const result = await db.select().from(pets).where(eq(pets.id, id));
        return result[0];
    }

    async create(data: NewPet): Promise<Pet> {
        console.log('Attempting to create pet with data:', JSON.stringify(data, null, 2));
        const result = await db.insert(pets).values(data).returning();
        console.log('Successfully created pet:', result[0]?.id);
        return result[0];
    }

    async update(id: string, data: Partial<NewPet>): Promise<Pet | undefined> {
        const result = await db
            .update(pets)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(pets.id, id))
            .returning();
        return result[0];
    }

    async delete(id: string): Promise<boolean> {
        const result = await db.delete(pets).where(eq(pets.id, id)).returning();
        return result.length > 0;
    }

    async updateStatus(
        id: string,
        status: (typeof petStatusEnum.enumValues)[number]
    ): Promise<Pet | undefined> {
        return this.update(id, { status });
    }
}

export const petService = new PetService();
