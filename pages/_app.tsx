import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import Head from "next/head";

export default function App({ Component, pageProps, router }: AppProps) {
  // 관리자 페이지는 NavBar와 Footer 제외
  if (router.pathname.startsWith("/admin")) {
    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap"
          />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap"
        />
      </Head>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
