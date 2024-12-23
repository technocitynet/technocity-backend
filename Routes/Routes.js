const express = require("express");
const LoginController = require("../Controllers/LoginController");
const GetAdminInfoController = require("../Controllers/GetAdminInfoController");
const AuthMiddleware = require("../Middleware/auth");
const CreateAccountController = require("../Controllers/CreateAccountController");
const UpdateAdminController = require("../Controllers/UpdateAdminController");
const AddAreaController = require("../Controllers/AddAreaController");
const GetFormDataController = require("../Controllers/GetFormDataController");
const AddUserController = require("../Controllers/AddUserController");
const GetUserController = require("../Controllers/GetUserController");
const UserCountController = require("../Controllers/UserCountController");
const GetEditUserInfoController = require("../Controllers/GetEditUserInfoController");
const EditUserController = require("../Controllers/EditUserController");
const DeleteUserController = require("../Controllers/DeleteUserController");
const SearchUserController = require("../Controllers/SearchUserController");
const UploadFileController = require("../Controllers/UploadFileController");
const FilterUserController = require("../Controllers/FilterUserController");
const AddPackageController = require("../Controllers/AddPackageController");
const DashboardDataController = require("../Controllers/DashboardDataController");
const GetUserDetailController = require("../Controllers/GetUserDetailController");
const GetDeactiveUserController = require("../Controllers/GetDeactiveUserController");
const GetSaleSatement = require("../Controllers/GetSaleSatement");
const DaySaleUserListController = require("../Controllers/DaySaleUserListController");
const GetAdvancePaymentUsers = require("../Controllers/GetAdvancePaymentUsers");
const GetBalancedUsers = require("../Controllers/GetBalancedUsers");
const DeleteFormData = require("../Controllers/DeleteFormData");
const AddExpanceController = require("../Controllers/AddExpanceController");
const DaysExpanseListController = require("../Controllers/DaysExpanseListController");
const GetAuthorizationToken = require("../Controllers/GetAuthorizationToken");
const GetAllAccountInfo = require("../Controllers/GetAllAccountInfo");
const CreateMainAdminAccount = require("../Controllers/CreateMainAdminAccount");
const DeleteAccountController = require("../Controllers/DeleteAccountController");
const UpdateAccountController = require("../Controllers/UpdateAccountController");

const Routes = express.Router();

// All API Routes Start

Routes.post("/create-main-account" , CreateMainAdminAccount);
Routes.post("/create-account", AuthMiddleware , CreateAccountController);
Routes.delete("/delete-account", AuthMiddleware , DeleteAccountController);
Routes.put("/update-account", AuthMiddleware , UpdateAccountController);
Routes.get("/get-all-account", AuthMiddleware , GetAllAccountInfo);
Routes.post("/login", LoginController);
Routes.post("/get-admin-info", AuthMiddleware, GetAdminInfoController);
Routes.post("/update-admin-info", AuthMiddleware, UpdateAdminController);
Routes.post("/add-area", AuthMiddleware, AddAreaController);
Routes.post("/add-package", AuthMiddleware, AddPackageController);
Routes.get("/get-form-data", AuthMiddleware, GetFormDataController);
Routes.get("/payment/advance/users", AuthMiddleware, GetAdvancePaymentUsers);
Routes.get("/payment/balanced/users", AuthMiddleware, GetBalancedUsers);
Routes.post("/add/user", AuthMiddleware, AddUserController);
Routes.post("/add/expanse", AuthMiddleware, AddExpanceController);
Routes.post("/get-auth-token", AuthMiddleware, GetAuthorizationToken);
Routes.delete("/formdata/:type/:id", AuthMiddleware, DeleteFormData);
Routes.get("/get/user", AuthMiddleware, GetUserController);
Routes.get("/get/sale-statement", AuthMiddleware, GetSaleSatement);
Routes.get("/get/day-sale-user-list", AuthMiddleware, DaySaleUserListController);
Routes.get("/get/day-expanse-list", AuthMiddleware, DaysExpanseListController);
Routes.get("/get/user/deactive", AuthMiddleware, GetDeactiveUserController);
Routes.get("/get/user-detail", AuthMiddleware, GetUserDetailController);
Routes.get("/user/count", AuthMiddleware, UserCountController);
Routes.get("/get/userInfo/edit", AuthMiddleware, GetEditUserInfoController);
Routes.get("/user/search", AuthMiddleware, SearchUserController);
Routes.delete("/user/delete/:userId", AuthMiddleware, DeleteUserController);
Routes.post("/user/edit", AuthMiddleware, EditUserController);
Routes.post("/user/upload-file", AuthMiddleware, UploadFileController);
Routes.get("/user/filter", AuthMiddleware, FilterUserController);
Routes.get("/dashboard/data", AuthMiddleware, DashboardDataController);

// Api Routes End

module.exports = Routes;
