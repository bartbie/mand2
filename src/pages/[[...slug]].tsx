/* redirect every route, including index, to contact if logged-in, else send to auth hell */
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import authOptions from "~/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  /* eslint-disable */
  const session = await getServerSession(context.req, context.res, authOptions);
  /* eslint-enable */

  // If the user is already logged in, redirect.
  // NOTE: Make sure not to redirect to the same page to avoid an infinite loop!
  return {
    redirect: {
      destination: session ? "/private/contact": "/auth/signin",
    },
  };
}

export default () => {/* empty since this route acts as a redirect */}