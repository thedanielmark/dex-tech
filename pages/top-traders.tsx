import Head from "next/head";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const traders = [
    {
      name: "Lindsay Walton",
      collections: "25",
      total_roi: "42.67",
      total_pnl: "2.23",
      key_price: "8.28",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Lindsay Walton",
      collections: "52",
      total_roi: "42.67",
      total_pnl: "2.23",
      key_price: "8.28",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Lindsay Walton",
      collections: "32",
      total_roi: "42.67",
      total_pnl: "2.23",
      key_price: "8.28",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    // More people...
  ];

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
          <div className="mt-16 mx-auto max-w-xl border border-zinc-800 shadow-[0_0px_60px_0px_rgba(79,70,229,0.3)] rounded-3xl p-3">
            {/* Table Start */}
            <div className="px-5">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead>
                  <tr className="uppercase">
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-black text-white sm:pl-0"
                    >
                      Leaderboard
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-black text-white"
                    >
                      Total ROI
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-black text-white"
                    >
                      Total PNL
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-black text-white"
                    >
                      Key Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-black text-white"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {traders.map((trader, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            <img
                              className="h-11 w-11 rounded-md"
                              src={trader.image}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-white">
                              {trader.name}
                            </div>
                            <div className="text-zinc-500">
                              {trader.collections} Holders
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-green-500">
                        {trader.total_roi}%
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-zinc-200">
                        {trader.total_pnl} ETH
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-zinc-200">
                        {trader.key_price}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 font-bold text-base text-zinc-200 cursor-pointer">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table End */}
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}
