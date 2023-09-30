import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource } from "@adminjs/mongoose";
import Model from "../models/userModel.js";
const { User, Recipes } = Model;

AdminJS.registerAdapter({
  Database,
  Resource,
});

// We will need to create an instance of AdminJS with a basic resource
const admin = new AdminJS({
  resources: [
    {
      resource: User,
    },
    {
      resource: Recipes,
    },
  ],
});

const adminRouter = AdminJSExpress.buildRouter(admin);

export default { admin, adminRouter };
