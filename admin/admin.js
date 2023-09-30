import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource } from "@adminjs/mongoose";
import Model from "../models/userModel.js";
const { User, Recipes } = Model;

AdminJS.registerAdapter({
  Database,
  Resource,
});

const usersNavigation = {
  name: "Users",
  icon: "User",
};
const recipesNavigation = {
  name: 'Recipes',
  icon: 'User',
}

const admin = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        navigation: usersNavigation,
      },
    },
    {
      resource: Recipes,
      options: {
        navigation: recipesNavigation,
      },
    },
  ],
  branding: {
    logo: "",
    companyName: "NutriChif",
    softwareBrothers: false,
  },
});

const adminRouter = AdminJSExpress.buildRouter(admin);

export default { admin, adminRouter };
