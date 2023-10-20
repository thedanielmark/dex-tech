import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

interface Props {
  children?: ReactNode;
}

export default function ApplicationLayout({ children }: Props) {
  const router = useRouter();
  const { address } = useAccount();

  return <div>{children}</div>;
}
