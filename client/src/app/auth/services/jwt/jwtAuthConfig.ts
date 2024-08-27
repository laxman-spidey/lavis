import { JwtAuthConfig } from "./JwtAuthProvider";

// const HOST =
//     "https://3000-idx-patient-portal-1723138675647.cluster-3g4scxt2njdd6uovkqyfcabgo6.cloudworkstations.dev/";
const HOST = "http://localhost:3000/";
const jwtAuthConfig: JwtAuthConfig = {
  tokenStorageKey: "jwt_access_token",
  signInUrl: HOST + "auth/login",
  signUpUrl: "mock-api/auth/sign-up",
  tokenRefreshUrl: "mock-api/auth/refresh",
  getUserUrl: "mock-api/auth/user",
  updateUserUrl: "mock-api/auth/user",
  updateTokenFromHeader: true,
};
// eslint-disable-next-line array-callback-return
// const config = Object.entries(jwtAuthConfig).reduce((acc, [key, value]) => {
//     acc[key] = HOST + value;
// });
export default jwtAuthConfig;
