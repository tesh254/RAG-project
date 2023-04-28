export const static_plans = [
    {
        id: "free",
        label: "Free",
        key: process.env.NEXT_PUBLIC_FREE_PROD_KEY,
        chats: 10,
    },
    {
        id: "basic",
        label: "Basic",
        key: process.env.NEXT_PUBLIC_BASIC_PROD_KEY,
        chats: 50,
    },
    {
        id: "pro",
        label: "Pro",
        key: process.env.NEXT_PUBLIC_PRO_PROD_KEY,
        chats: 100,
    },
    {
        id: "developer",
        label: "Developer",
        key: process.env.NEXT_PUBLIC_DEV_PROD_KEY,
        chats: Infinity,
    }
];
