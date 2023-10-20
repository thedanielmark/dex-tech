import Image from "next/image";
import { PropsWithChildren, ReactElement } from "react";

export default function Header({
  children,
}: PropsWithChildren<unknown>): ReactElement {
  return (
    <div className="flex items-center space-x-2 text-xs bold bg-gray-800 p-2 shadow rounded-3xl">
      <Image
        src={`/gradientPfps/${Math.floor(
          Math.random() * (10 - 1 + 1) + 1
        )}.png`}
        alt="User"
        height={150}
        width={150}
        className="h-5 w-5 rounded-full"
      />
      {children}
    </div>
  );
}
