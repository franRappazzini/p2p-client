"use client";

import dynamic from "next/dynamic";

const DynamicProvider = dynamic(
  () => import("./dynamic-provider-inner").then((m) => m.DynamicProviderInner),
  { ssr: false }
);

export default DynamicProvider;
