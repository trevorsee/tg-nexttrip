import Head from "next/head";
import { AnimatePresence } from "framer-motion";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "tailwindcss/tailwind.css";
import "@/styles/global.css";

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <title>Bus Routes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <AnimatePresence
        exitBeforeEnter
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Component {...pageProps} canonical={router.route} key={router.route} />
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default MyApp;
