import Head from "next/head";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { darkTheme, SwapWidget } from "@uniswap/widgets";
import { useEthersSigner } from "@/utilities/ethers";
import "@uniswap/widgets/fonts.css";
import { useEffect } from "react";

const jsonRpcUrlMap = {
  1: ["https://eth-mainnet.g.alchemy.com/v2/toazB2iE1mnm6oddkzmN0dTgBUXE03UD"],
};

export default function Home() {
  // const { address } = useAccount();
  const signer: any = useEthersSigner();

  useEffect(() => {
    console.log(signer);
  }, [signer]);

  return (
    <>
      <Head>
        <title>
          Dashboard - DexTech | Democratizing EV Technology using the Blockchain
        </title>
        <meta
          name="title"
          content="Notifications - DexTech | Push Notification Service for the Neo Blockchain"
        />
        <meta
          name="description"
          content="Stay informed and in-the-know with real-time push
            notifications on transactions, smart contracts, and network
            developments. Empower your Neo experience with DexTech's
            timely alerts, ensuring you never miss a beat on the Neo
            Blockchain."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://neocast.blitzcrafthq.com" />
        <meta
          property="og:title"
          content="Notifications - DexTech | Push Notification Service for the Neo Blockchain"
        />
        <meta
          property="og:description"
          content="Stay informed and in-the-know with real-time push
            notifications on transactions, smart contracts, and network
            developments. Empower your Neo experience with DexTech's
            timely alerts, ensuring you never miss a beat on the Neo
            Blockchain."
        />
        <meta property="og:image" content="/meta-image.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://neocast.blitzcrafthq.com/"
        />
        <meta
          property="twitter:title"
          content="Notifications - DexTech | Push Notification Service for the Neo Blockchain"
        />
        <meta
          property="twitter:description"
          content="Stay informed and in-the-know with real-time push
            notifications on transactions, smart contracts, and network
            developments. Empower your Neo experience with DexTech's
            timely alerts, ensuring you never miss a beat on the Neo
            Blockchain."
        />
        <meta property="twitter:image" content="/meta-image.jpg" />
        <style>
          {`input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus
          input:-webkit-autofill, 
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover
          textarea:-webkit-autofill:focus,
          select:-webkit-autofill,
          select:-webkit-autofill:hover,
          select:-webkit-autofill:focus { 
            -webkit-text-fill-color: #000;
            -webkit-box-shadow: 0 0 0px 1000px #00000000 inset;
            transition: background-color 5000s ease-in-out 0s;
          }
          input::placeholder {
            -webkit-text-fill-color: #a1a1aa;
          }
          /* Chrome, Safari, Edge, Opera */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
        </style>
      </Head>

      <ApplicationLayout>
        <div className="w-full">
          <div className="mt-16 mx-auto max-w-xl shadow-[0_0px_60px_0px_rgba(79,70,229,0.3)] rounded-3xl">
            {signer && (
              <SwapWidget
                width="100%"
                theme={darkTheme}
                provider={signer.data?.provider}
                jsonRpcUrlMap={jsonRpcUrlMap}
              />
            )}
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}
