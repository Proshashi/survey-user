"use client";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

let browserQueryClient: QueryClient | undefined = undefined;

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
};

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = getQueryClient();
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <Component {...pageProps} />
        </ConfigProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
