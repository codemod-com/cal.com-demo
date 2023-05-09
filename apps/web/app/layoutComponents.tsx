// "use client";

// type Props = Record<string, unknown> & DocumentProps;
// function setHeader(ctx: NextPageContext, name: string, value: string) {
//   try {
//     ctx.res?.setHeader(name, value);
//   } catch (e) {
//     // Getting "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" when revalidate calendar chache
//     console.log(`Error setting header ${name}=${value} for ${ctx.asPath || "unknown asPath"}`, e);
//   }
// }

// export async function getStaticProps(ctx: DocumentContext) {
//   const { nonce } = csp(ctx.req || null, ctx.res || null);
//   if (!process.env.CSP_POLICY) {
//     setHeader(ctx, "x-csp", "not-opted-in");
//   } else if (!ctx.res?.getHeader("x-csp")) {
//     // If x-csp not set by gSSP, then it's initialPropsOnly
//     setHeader(ctx, "x-csp", "initialPropsOnly");
//   }
//   const asPath = ctx.asPath || "";
//   // Use a dummy URL as default so that URL parsing works for relative URLs as well. We care about searchParams and pathname only
//   const parsedUrl = new URL(asPath, "https://dummyurl");
//   const isEmbed = parsedUrl.pathname.endsWith("/embed") || parsedUrl.searchParams.get("embedType") !== null;
//   // const initialProps = await Document.getInitialProps(ctx);
//   return { isEmbed, nonce };

//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }
