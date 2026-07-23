import { Request, Response } from 'express'
import { db } from '../db/db.js';
import { remindersTable  } from "../db/schema";
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

const reminderSchema = z.object({
    task: z.string(),
    time: z.coerce.date()
});

type NewReminder = typeof remindersTable.$inferInsert;

export async function postReminder(req: Request, res: Response) {
    try {
        const result = reminderSchema.safeParse(req.body);
        
        if(!result.success) {
            return res.status(401).json({
                status: 'error',
                message: result.error.format()
            });
        }

        const { task, time } = result.data;

        const newReminder: NewReminder = {
            id: uuidv4(),
            task,
            time,
            nextRemindTime: new Date(time.getTime())
        }


        const [post] = await db.insert(remindersTable).values(newReminder).returning();


        return res.status(201).json({
            status: 'success',
            result: post
        });

    } catch (error) {
        console.error("DB ERROR:", error); 
        return res.status(500).json({
            status: 'error',
            message: error
        });
    }
}

export async function getReminders(req: Request, res: Response) {
    try {
        const reminders = await db.select().from(remindersTable);

        res.status(200).json({
            status: 'success',
            number: reminders.length,
            results: reminders
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({
            status: 'error',
            message: error
        })
    }  
}

export async function markComplete(req: Request, res: Response) {
    try {
        const id = req.params.id;

        if(!id || Array.isArray(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Request'
            })
        }

        const reminder = await db.update(remindersTable).set({ status: "Completed" }).where(eq(remindersTable.id, id)).returning();

        res.status(201).json({
            status: 'success',
            result: reminder
        })
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({
            status: 'error',
            message: error
        })
    }
}

export async function deleteReminder(req: Request, res: Response) {
    try {
        const id = req.params.id;

        if(!id || Array.isArray(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Request'
            });
        }

        const deleted = await db.delete(remindersTable).where(eq(remindersTable.id, id));

        res.status(204).json({
            status: 'success',
            result: deleted
        })
    } catch (error) {
        console.error("Server Error: ", error);
        return res.status(500).json({
            status: "error",
            message: error
        })
    }
}

// export async function getReminderByID(req: Request, res: Response) {
//     try {
//         const id = req.params.id;

//         if(!id || Array.isArray(id)) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Invalid request'
//             });
//         }

//         const reminder = await db.select().from(remindersTable).where(eq(remindersTable.id, id));

//         res.status(200).json({
//             status: 'success',
//             result: reminder
//         });
//     } catch (error) {
//         console.error("Server Error:", error);
//         return res.status(500).json({
//             status: 'error',
//             message: error
//         })
//     }
// }

