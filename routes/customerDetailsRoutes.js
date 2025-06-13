const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const {
  storeUserDetails,
  registrationToken,
  logout,
  profileImageUpload
} = require("../controllers/customerDetailsController");

const routes = [
  {
    method: HttpMethods.PUT,
    path: "/customers/:userId/details",
    handlers: [profileImageUpload,storeUserDetails],
  },

  {
    method: HttpMethods.PUT,
    path: "/users/:userId/tokens",
    handlers: [registrationToken]
  },

  {
    method: HttpMethods.PUT,
    path: "/users/:userId/logout",
    handlers: [logout]
  }
];

const router = createRouter(routes);

module.exports = router;