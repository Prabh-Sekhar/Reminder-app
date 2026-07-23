import { db } from '../db/db.js';
import { remindersTable  } from "../db/schema";
import { eq, inArray, lte, and } from 'drizzle-orm';
import nodeCron from 'node-cron';

const remindUser = async () => {
    const reminders = await db.select().from(remindersTable).where(
        and(
            inArray(remindersTable.status, ["Pending", "Avoided"]),
            lte(remindersTable.nextRemindTime, new Date()) 
        )
    )
    for(const reminder of reminders) {
        let interval: number;
        let message: string;
        if(reminder.remindCount >= 8) {
            interval = 24 * 60 * 60 * 1000;
            message = `Ignoring it won't make it disapppear: ${reminder.task}`;
        } else if(reminder.remindCount >= 5) {
            interval = 2 * 60 * 60 * 1000;
            message = `You've been putting this off for a while now: ${reminder.task}`;
            await db.update(remindersTable).set({ status: 'Avoided' }).where(eq(remindersTable.id, reminder.id));
        } else if(reminder.remindCount >= 3) {
            interval = 30 * 60 * 1000;
            message = `Just a reminder, don't forget to do your task: ${reminder.task}`;
        } else {
            interval = 10 * 60 * 1000;
            message = `Hey, it's time for your task: ${reminder.task}`;
        }
        await db.update(remindersTable)
        .set({
            nextRemindTime: new Date(Date.now() + interval),
            remindCount: reminder.remindCount + 1
        })
        .where(eq(remindersTable.id, reminder.id));

        console.log(message);
    }
}

nodeCron.schedule("*/1 * * * *", remindUser);