/* redirect every route, includrng index, to contact if logged-in, else send to auth hell */
import type { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  /* eslint-disable */
  const session = await getServerAuthSession(ctx);
  /* eslint-enable */

  // If the user is already logged in, redirect.
  // NOTE: Make sure not to redirect to the same page to avoid an infinite loop!
  return {
    redirect: {
      destination: session ? "/protected/contact" : "/auth/signin",
      pernament: false,
    },
  };
}

export default () => {
  /* empty since this page acts as redirect */
};
