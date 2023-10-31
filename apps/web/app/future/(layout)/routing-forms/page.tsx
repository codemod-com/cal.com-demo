import Page from "@pages/routing-forms/index";

const getProps = () => {
  return {
    redirect: {
      destination: `/apps/routing-forms/forms`,
      permanent: false,
    },
  };
};

export default function RoutingForms() {
  const props = getProps();
  return <Page {...props} />;
}
