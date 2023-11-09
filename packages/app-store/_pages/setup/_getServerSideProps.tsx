import type { GetServerSidePropsContext } from "next";

export const AppSetupPageMap = {
  alby: import("../../alby/pages/setup/_getServerSideProps"),
  make: import("../../make/pages/setup/_getServerSideProps"),
  zapier: import("../../zapier/pages/setup/_getServerSideProps"),
  stripe: import("../../stripepayment/pages/setup/_getServerSideProps"),
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { slug } = ctx.params || {};
  if (typeof slug !== "string") return { notFound: true } as const;

  if (!(slug in AppSetupPageMap)) return { props: {} };

  const page = await AppSetupPageMap[slug as keyof typeof AppSetupPageMap];

  if (!page.getServerSideProps) return { props: {} };

  const props = await page.getServerSideProps(ctx);

  return props;
};

// Hack to avoid
// Error: Attempted to call getServerSideProps() from the server but getServerSideProps is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.
export default function () {
  return "";
}
