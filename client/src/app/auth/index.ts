export type CustomResponse<T> = {
  status: boolean;
  message: string;
  error: string;
  data: T;
};
export { default as authRoles } from "./authRoles";
