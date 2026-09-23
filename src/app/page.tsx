import type { Metadata } from "next";
import Landing from "./components/Landing";

// The root layout's title and description carry; this only pins the
// canonical, so ?utm and the creator copies all resolve to one URL.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <Landing />;
}
