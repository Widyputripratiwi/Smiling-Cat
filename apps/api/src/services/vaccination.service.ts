import { eq, desc, gte, and } from 'drizzle-orm';
import { db } from '../config/database';
import { vaccinations } from '../db/schema/vaccinations';
import { pets } from '../db/schema/pets';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Vaccination = InferSelectModel<typeof vaccinations>;
export type NewVaccination = InferInsertModel<typeof vaccinations>;

export class VaccinationService {
    async findAllByPetId(petId: string): Promise<Vaccination[]> {
        return db
            .select()
            .from(vaccinations)
            .where(eq(vaccinations.petId, petId))
            .orderBy(desc(vaccinations.dueDate));
    }

    async findById(id: string): Promise<Vaccination | undefined> {
        const result = await db.select().from(vaccinations).where(eq(vaccinations.id, id));
        return result[0];
    }

    async create(data: NewVaccination): Promise<Vaccination> {
        const result = await db.insert(vaccinations).values(data).returning();
        return result[0];
    }

    async update(id: string, data: Partial<NewVaccination>): Promise<Vaccination | undefined> {
        const result = await db
            .update(vaccinations)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(vaccinations.id, id))
            .returning();
        return result[0];
    }

    async delete(id: string): Promise<boolean> {
        const result = await db.delete(vaccinations).where(eq(vaccinations.id, id)).returning();
        return result.length > 0;
    }

    async getUpcomingVaccinations(userId: string): Promise<Vaccination[]> {
        // Get all vaccinations with due dates in the future for this user's pets
        const today = new Date().toISOString().split('T')[0];
        const results = await db
            .select({
                vaccination: vaccinations,
            })
            .from(vaccinations)
            .innerJoin(pets, eq(vaccinations.petId, pets.id))
            .where(
                and(
                    eq(pets.userId, userId),
                    eq(vaccinations.status, 'scheduled'),
                    gte(vaccinations.dueDate, today)
                )
            )
            .orderBy(vaccinations.dueDate);

        return results.map(r => r.vaccination);
    }

    async markAsCompleted(
        id: string,
        administeredBy?: string
    ): Promise<Vaccination | undefined> {
        return this.update(id, {
            status: 'completed',
            administeredDate: new Date().toISOString().split('T')[0],
            administeredBy,
        });
    }
}

export const vaccinationService = new VaccinationService();
