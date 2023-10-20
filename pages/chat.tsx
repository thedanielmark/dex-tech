import { useClient } from "@/hooks/useClient";
import LoginView from "@/views/LoginView";
import TimeAgo from "javascript-time-ago";
import { ReactNode, useEffect, useState } from "react";
import { useConversations } from "../hooks/useConversations";
import Link from "next/link";
import { useLatestMessages } from "../hooks/useLatestMessages";
import ConversationCellView from "../views/ConversationCellView";
import en from "javascript-time-ago/locale/en.json";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import ConversationView from "@/views/ConversationView";
import { findConversation } from "@/model/conversations";
import { useRouter } from "next/router";

TimeAgo.addDefaultLocale(en);

interface Props {
  children?: ReactNode;
}

export default function Chat({ children }: Props) {
  const router = useRouter();
  const client = useClient();
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(
    window.localStorage.getItem("readReceiptsEnabled") === "true"
  );
  const [conversationId, setConversationId] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);
  //   const [conversationObj, setConversationObj] = useState<any>();
  const conversations = useConversations(client);
  const latestMessages = useLatestMessages(conversations);

  useEffect(() => {
    window.localStorage.setItem(
      "readReceiptsEnabled",
      String(readReceiptsEnabled)
    );
  }, [readReceiptsEnabled]);

  useEffect(() => {
    (async () => {
      const conversationIdTemp: any = router.query.conversationId;
      setConversationId(conversationIdTemp);
      console.log(conversationId);
    })();
  }, [conversationId, router.query.conversationId]);

  useEffect(() => {
    (async () => {
      if (conversationId) {
        const conversationTemp = await findConversation(conversationId);
        setConversation(conversationTemp);
        console.log(conversationTemp);
      }
    })();
  }, [conversationId]);

  return (
    <ApplicationLayout>
      <div className="mt-16 max-w-3xl mx-auto shadow-[0_0px_60px_0px_rgba(79,70,229,0.3)] rounded-3xl bg-gray-900 border border-gray-800 min-h-[500px] max-h-[500px]">
        {client ? (
          <div className="grid grid-cols-12 gap-x-5">
            <div className="col-span-4">
              {conversations?.length == 0 && <p>No conversations yet.</p>}
              {conversations
                ? conversations.map((conversation, i) => (
                    <Link
                      href={`/chat?conversationId=${conversation.topic}`}
                      key={conversation.topic}
                    >
                      <ConversationCellView
                        conversation={conversation}
                        latestMessage={latestMessages[i]}
                      />
                    </Link>
                  ))
                : "Could not load conversations"}
            </div>
            <div className="col-span-8">
              {conversation && <ConversationView conversation={conversation} />}
            </div>
          </div>
        ) : (
          <LoginView />
        )}
      </div>
    </ApplicationLayout>
  );
}
