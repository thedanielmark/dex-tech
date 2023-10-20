import { useClient } from "@/hooks/useClient";
import LoginView from "@/views/LoginView";
import HomeView from "@/views/HomeView";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";

TimeAgo.addDefaultLocale(en);

export default function Chat() {
  const client = useClient();
  return (
    <ApplicationLayout>
      <div className="mt-16 max-w-3xl mx-auto shadow-[0_0px_60px_0px_rgba(79,70,229,0.3)] rounded-3xl bg-gray-900 border border-gray-800 p-2">
        {client ? <HomeView /> : <LoginView />}
      </div>
    </ApplicationLayout>
  );
}
