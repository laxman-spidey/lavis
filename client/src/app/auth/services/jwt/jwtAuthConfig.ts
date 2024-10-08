import { JwtAuthConfig } from "./JwtAuthProvider";

// const HOST =
//     "https://3000-idx-patient-portal-1723138675647.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev/";
const jwtAuthConfig: JwtAuthConfig = {
  tokenStorageKey: "jwt_access_token",
  signInUrl: "auth/login",
  signUpUrl: "auth/register",
  // signInUrl: "mock-api/auth/sign-in",
  // signUpUrl: "mock-api/signup",
  // signOutUrl: "mock-api/auth/logout",
  tokenRefreshUrl: "mock-api/auth/refresh",
  getUserUrl: "auth/user",
  updateUserUrl: "mock-api/auth/user",
  updateTokenFromHeader: true,
};
// eslint-disable-next-line array-callback-return
// const config = Object.entries(jwtAuthConfig).reduce((acc, [key, value]) => {
//     acc[key] = HOST + value;
// });
export default jwtAuthConfig;
