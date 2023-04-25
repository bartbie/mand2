/* secure /private routes */
export { default } from "next-auth/middleware";
export const config = { matcher: ["/private"] }