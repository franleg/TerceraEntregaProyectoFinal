export default {
    app: {
        DOMAIN: process.env.DOMAIN
    },
    mongo: {
        USER: process.env.MONGO_USER,
        PASSWORD: process.env.MONGO_PASSWORD,
        DATABASE: process.env.MONGO_DATABASE
    },
    session: {
        SECRET: process.env.SESSION_SECRET,
    },
    admin: {
        EMAIL: process.env.ADMIN_EMAIL,
        PASSWORD: process.env.ADMIN_PASSWORD,
        NAME: process.env.ADMIN_NAME
    }
}