import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CONTRACT_ABIS, CONTRACT_ADDRESS } from "@/utilities/contractDetails";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useDisconnect,
} from "wagmi";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import { PushAPI } from "@pushprotocol/restapi";
import { Chat } from "@pushprotocol/uiweb";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// interface Props {
//   children?: ReactNode;
//   customHeader?: string;
//   customHeaderDescription?: string;
// }

export default function ApplicationLayout({ children }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [openRegisterTraderModal, setOpenRegisterTraderModal] = useState(false);
  const { address } = useAccount();
  // const { disconnect } = useDisconnect({
  //   onSuccess() {
  //     router.push("/");
  //   },
  // });
  const [inputs, setInputs] = useState({
    contractName: "",
    contractSymbol: "",
    groupChatName: "",
  });

  const handleInput = (event) => {
    event.persist();
    setInputs((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  // Function to create trader token
  const {
    data: createTraderTokenData,
    isLoading: createTraderTokenIsLoading,
    isSuccess: createTraderTokenIsSuccess,
    write: createTraderToken,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABIS.FactoryContract.abi,
    functionName: "createTraderToken",
  });

  const {
    data: getTraderContractData,
    isLoading: getTraderContractLoading,
    refetch: refetchGetTraderContractData,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABIS.FactoryContract.abi,
    functionName: "getTraderContract",
    args: [address],
  });

  // Function to update ChatID in trader contract
  const {
    data: setChatIDForTraderData,
    isLoading: setChatIDForTraderIsLoading,
    isSuccess: setChatIDForTraderIsSuccess,
    write: setChatIDForTrader,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABIS.FactoryContract.abi,
    functionName: "setChatIDForTrader",
  });

  const handleTraderTokenCreation = async (event) => {
    event.preventDefault();
    createTraderToken({
      args: [inputs.contractName, inputs.contractSymbol, "foobar"],
    });

    // Read contract we just created
    const traderContractData = await refetchGetTraderContractData();
    console.log(traderContractData.data);

    const chatID = await createGroup(
      inputs.groupChatName,
      traderContractData.data
    );

    // Set ChatID for trader
    setChatIDForTrader({
      args: [traderContractData.data, chatID],
    });
  };

  const createGroup = async (groupName, contractAddress) => {
    // Creating a random signer from a wallet, ideally this is the wallet you will connect
    const signer = ethers.Wallet.createRandom();

    console.log(
      `Signer address: ${signer.address} | Signer private key: ${signer.privateKey}`
    );

    // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
    const user = await PushAPI.initialize(signer, {
      env: "staging",
    });

    // Creating your token gated community
    const createTokenGatedGroup = await user.chat.group.create(groupName, {
      description: `A Token Gated ${groupName}`, // provide short description of group
      image: "data:image/png;base64,iVBORw0K...", // provide base64 encoded image
      members: [], // not needed, rules define this, can omit
      admins: [], // not needed as per problem statement, can omit
      private: true,
      rules: {
        entry: {
          // entry is based on conditions
          conditions: {
            any: [
              // any of the decider should allow entry
              {
                // decicder 2 - If wallet holds 1 NFT on polygon testnet
                any: [
                  {
                    // criteria 1
                    type: "PUSH", // define type that rules engine should go for
                    category: "ERC721", // define it's ERC20 token that you want to check, supports ERC721 as well
                    subcategory: "holder", // define if you are checking 'holder'
                    data: {
                      contract: `eip155:80001:${contractAddress}`, // contract address of token
                      comparison: ">=", // what comparison needs to pass
                      amount: 1, // amount that needs to passed
                      decimals: 18,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    });
    return createTokenGatedGroup.chatId;
  };

  // Close modal if group is successfully created
  useEffect(() => {
    if (setChatIDForTraderIsSuccess) {
      setOpenRegisterTraderModal(false);
    }
  }, [setChatIDForTraderIsSuccess]);

  return (
    <>
      <Head>
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
            -webkit-text-fill-color: #fff;
            -webkit-box-shadow: 0 0 0px 1000px #00000000 inset;
            transition: background-color 5000s ease-in-out 0s;
          }
          input::placeholder {
            -webkit-text-fill-color: #a1a1aa;
          }
          .rainbow-kit-connect-button > div > button {
            border-radius: 9999px !important;
          }
        `}
        </style>
      </Head>
      <Disclosure as="nav" className="bg-gray-900">
        {({ open }) => (
          <>
            <div className="px-2 sm:px-4 lg:px-8">
              <div className="grid grid-cols-12 h-16">
                <div className="col-span-4 flex items-center px-2 lg:px-0">
                  <div className="flex-shrink-0 flex items-center">
                    <Image
                      className="h-12 w-auto"
                      src="/logo/dex-logo.png"
                      alt="Dex Tech"
                      width={1920}
                      height={1080}
                    />
                    <div className="font-black text-white text-xl">DexTech</div>
                  </div>
                  <div className="hidden lg:ml-12 lg:block">
                    <div className="flex space-x-4">
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <Link
                        href="/swap"
                        className={`rounded-md bg-gray-900 px-3 py-2 text-sm font-medium hover:text-white ${
                          router.pathname === "/swap"
                            ? "text-white bg-gray-700"
                            : "text-gray-300"
                        }`}
                      >
                        Swap
                      </Link>
                      <Link
                        href="/top-traders"
                        className={`rounded-md bg-gray-900 px-3 py-2 text-sm font-medium hover:text-white ${
                          router.pathname === "/top-traders"
                            ? "text-white bg-gray-700"
                            : "text-gray-300"
                        }`}
                      >
                        Top Traders
                      </Link>
                      <Link
                        href="/activity"
                        className={`rounded-md bg-gray-900 px-3 py-2 text-sm font-medium hover:text-white ${
                          router.pathname === "/activity"
                            ? "text-white bg-gray-700"
                            : "text-gray-300"
                        }`}
                      >
                        Activity
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 flex flex-1 items-center justify-center px-2 lg:ml-6">
                  <div className="w-full max-w-lg lg:max-w-xs border-2 border-gray-800 rounded-2xl overflow-hidden">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="search"
                        name="search"
                        className="block w-full rounded-md border-0 bg-gray-900 py-1.5 pl-10 pr-3 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Search"
                        type="search"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="col-span-4 hidden lg:ml-4 lg:block">
                  <div className="h-full flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setOpenRegisterTraderModal(true)}
                      className="ml-4 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100"
                    >
                      Register As Trader
                    </button>

                    {/* <button
                      type="button"
                      className="ml-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Connect
                    </button> */}
                    <div className="ml-2 rainbow-kit-connect-button">
                      <ConnectButton
                        chainStatus="none"
                        showBalance={false}
                        label="Connect"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                >
                  Dashboard
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Team
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Projects
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Calendar
                </Disclosure.Button>
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      Tom Cook
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      tom@example.com
                    </div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Your Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div>{children}</div>
      {/* Dex.Chat Button Start */}
      <button
        type="button"
        onClick={() => setShow(true)}
        className="absolute right-6 bottom-6 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
      >
        Dex.Chat
      </button>
      {/* Dex.Chat Button End */}
      {/* Dex.Chat Widget Start */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-end sm:p-6"
      >
        <div className="flex h-4/6 w-full flex-col items-center space-y-4 sm:items-end justify-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="h-full pointer-events-auto w-full max-w-xs overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-700">
              <div className="p-4">
                <div className="flex items-start">
                  {/* Widget Header Start */}
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <div className="uppercase text-gray-100 text-base font-bold">
                        Dex.Tech
                      </div>
                      <button
                        type="button"
                        // id="sdk-trigger-id"
                        className="ml-4 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        0.120 ETH
                      </button>
                    </div>
                  </div>
                  {/* Widget Header End */}
                  {/* Widget Content Start */}
                  <Chat
                    account="0x7B540B1E4e54a9D20B2399A945A1EAf0628edF13"
                    env="staging"
                  />
                  {/* Widget Content End */}
                  {/* <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      {/* Dex.Chat Widget Start */}
      {/* Register Trader Modal Start */}
      <Transition.Root show={openRegisterTraderModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setOpenRegisterTraderModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 sm:mx-0 sm:h-10 sm:w-10">
                      <UserPlusIcon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-white"
                      >
                        Register Yourself As A Trader
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-200">
                          Create a collection of NFTs for yourself that will act
                          as keys, allowing other traders who hold your keys to
                          interact with you.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Register Trader Form Start */}
                  <form onSubmit={handleTraderTokenCreation}>
                    <div className="mt-5 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-blue-600">
                      <label
                        htmlFor="contractName"
                        className="block text-xs font-medium text-gray-200"
                      >
                        Contract Name
                      </label>
                      <input
                        type="text"
                        name="contractName"
                        id="contractName"
                        onChange={handleInput}
                        value={inputs.contractName}
                        className="block w-full border-0 p-0 text-white font-bold placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 bg-gray-900"
                        placeholder="Danny's Group Chat Contract"
                      />
                    </div>

                    <div className="mt-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-blue-600">
                      <label
                        htmlFor="contractSymbol"
                        className="block text-xs font-medium text-gray-200"
                      >
                        Contract Symbol
                      </label>
                      <input
                        type="text"
                        name="contractSymbol"
                        id="contractSymbol"
                        onChange={handleInput}
                        value={inputs.contractSymbol}
                        className="block w-full border-0 p-0 text-white font-bold placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 bg-gray-900"
                        placeholder="DGC"
                      />
                    </div>

                    <div className="mt-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 focus-within:ring-blue-600">
                      <label
                        htmlFor="groupChatName"
                        className="block text-xs font-medium text-gray-200"
                      >
                        Group Chat Name
                      </label>
                      <input
                        type="text"
                        name="groupChatName"
                        id="groupChatName"
                        onChange={handleInput}
                        value={inputs.groupChatName}
                        className="block w-full border-0 p-0 text-white font-bold placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 bg-gray-900"
                        placeholder="Danny's Group Chat"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-4 w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      {setChatIDForTraderIsLoading ? (
                        <>Creating Group Chat</>
                      ) : (
                        <>Next</>
                      )}
                    </button>
                  </form>
                  {/* Register Trader Form End */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Register Trader Modal End */}
    </>
  );
}