/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://account:9PSBXFeU6YTr@ep-steep-violet-a52y3o9w.us-east-2.aws.neon.tech/AI-Content-Generator?sslmode=require',
    }
};