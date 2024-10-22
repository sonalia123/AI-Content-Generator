import { pgTable, serial, text, varchar, boolean } from "drizzle-orm/pg-core";

export const AIOutput=pgTable('aiOutput' ,{
    id:serial('id').primaryKey(),
    formData:text('formData').notNull(),
    aiResponse:text('aiResponse'),
    templateSlug:varchar('templateSlug').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt')
})

export const UserSubscription=pgTable('userSubscription',{
    id:serial('id').primaryKey(),
    email:varchar('email').notNull(),
    userName:varchar('userName').notNull(),
    active:boolean('active').default(true),
    paymentId:varchar('paymentId'),
    joinDate:varchar('joinDate')
})