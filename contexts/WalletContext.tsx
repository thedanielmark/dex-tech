import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import {
  configureChains,
  WagmiConfig,
  useNetwork,
  useAccount,
  useDisconnect,
} from "wagmi";
import { useSetClient } from "../hooks/useClient";
import { Client } from "@xmtp/xmtp-js";
import { useEthersSigner } from "@/utilities/ethers";

function WalletSetter({
  setWaitingForSignatures,
  children,
}: PropsWithChildren<{
  setWaitingForSignatures: (state: boolean) => void;
}>): ReactElement {
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const signer = useEthersSigner({ chainId: chain?.id });
  // const { data: signer } = useSigner({
  //   onError: () => {
  //     setWaitingForSignatures(false);
  //     disconnect();
  //   },
  // });
  const setClient = useSetClient();

  useEffect(() => {
    if (signer) {
      setWaitingForSignatures(true);
      (async () => {
        try {
          const client = await Client.create(signer, {
            env: "dev",
          });

          setClient(client);
          setWaitingForSignatures(false);
        } catch {
          disconnect();
          setWaitingForSignatures(false);
        }
      })();
    }
  }, [!!signer]);

  return <>{children}</>;
}

export default function WalletContext({
  children,
}: PropsWithChildren<unknown>): ReactElement {
  const [waitingForSignatures, setWaitingForSignatures] = useState(false);

  return (
    <WalletSetter setWaitingForSignatures={setWaitingForSignatures}>
      {waitingForSignatures ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
          <div className="mx-auto max-w-3xl"></div>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Waiting for signatures…
              </h3>
              <p>
                Sign the messages you&apos;ve been prompted with in your wallet
                app to sign in to XMTP.
              </p>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </WalletSetter>
  );
}