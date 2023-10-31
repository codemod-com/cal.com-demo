import Page from "@pages/routing-forms/[...pages]";
import z from "zod";

const paramsSchema = z
  .object({
    pages: z.array(z.string()),
  })
  .catch({
    pages: [],
  });

const getProps = (params: any) => {
  const { pages } = paramsSchema.parse(params);

  return {
    redirect: {
      destination: `/apps/routing-forms/${pages.length ? pages.join("/") : ""}`,
      permanent: false,
    },
  };
};

export default function RoutingForms({ params }: { params: any }) {
  const props = getProps(params);
  return <Page {...props} />;
}
