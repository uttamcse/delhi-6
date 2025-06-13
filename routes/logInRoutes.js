const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const { createAccount, verifyOtp, refreshAccessToken } = require("../controllers/logInController");

// OTP routes
const routes = [
    {
      method: HttpMethods.POST,
      path: "/create",
      handlers: [createAccount],
    },
    {
      method: HttpMethods.PUT,
      path: "/otp/verify",
      handlers: [verifyOtp],
    },
    {
      method: HttpMethods.POST,
      path: "/token/refresh",
      handlers: [refreshAccessToken],
    },
  ];
  
  const router = createRouter(routes);
  
  module.exports = router;