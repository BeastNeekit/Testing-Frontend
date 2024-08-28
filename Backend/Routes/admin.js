const express = require('express');
const router = express.Router();

(async () => {
    const { default: AdminJS } = await import('adminjs');
    const { default: AdminJSExpress } = await import('@adminjs/express');
    const AdminJSMongoose = await import('@adminjs/mongoose');
    const User = require('../model/User');
    const Product = require('../model/Product');
    const Order = require('../model/Order');

    AdminJS.registerAdapter({
        Database: AdminJSMongoose.Database,
        Resource: AdminJSMongoose.Resource,
    });

    const adminJs = new AdminJS({
        resources: [
            { resource: User },
            { resource: Product },
            { resource: Order }
        ],
        rootPath: '/admin',
    });

    // Set up basic authentication
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        authenticate: async (email, password) => {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                return { email };
            }
            return null;
        },
        cookiePassword: 'some-secret-password-used-to-secure-cookie', // Change this to a secure value
    });

    router.use(adminRouter);
})();

module.exports = router;
