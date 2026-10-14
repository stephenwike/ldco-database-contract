import { CONTRACT_VERSION } from "@/contract";

export const dynamic = "force-dynamic";

export default function Home() {
  return <p>LDCO database contract v{CONTRACT_VERSION}</p>;
}
