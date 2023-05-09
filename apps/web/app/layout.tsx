import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = "en";
  const isEmbed = false;

  return (
    <html lang={locale}>
      {/* <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#ff0000" />
        <meta name="theme-color" content="var(--cal-bg)" />
      </head> */}

      <body
        className="dark:bg-darkgray-50 desktop-transparent bg-subtle antialiased"
        style={
          isEmbed
            ? {
                background: "transparent",
                // Keep the embed hidden till parent initializes and
                // - gives it the appropriate styles if UI instruction is there.
                // - gives iframe the appropriate height(equal to document height) which can only be known after loading the page once in browser.
                // - Tells iframe which mode it should be in (dark/light) - if there is a a UI instruction for that
                visibility: "hidden",
              }
            : {}
        }>
        {/* <Main /> */}
        {children}
        {/* <NextScript nonce={nonce} /> */}
      </body>
    </html>
  );
}

export const metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};
