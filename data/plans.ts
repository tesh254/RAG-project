export const static_plans = [
    {
        id: "basic",
        label: "Basic",
        key: process.env.NEXT_PUBLIC_BASIC_PROD_KEY,
        chats: 100,
    },
    {
        id: "pro",
        label: "Pro",
        key: process.env.NEXT_PUBLIC_PRO_PROD_KEY,
        chats: Infinity,
    },
    {
        id: "developer",
        label: "Developer",
        key: process.env.NEXT_PUBLIC_DEV_PROD_KEY,
        chats: Infinity,
    }
];
