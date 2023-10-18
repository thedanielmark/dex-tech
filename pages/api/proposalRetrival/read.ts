import { db } from "@/utilities/mongo";

export default async function read(req: any, res: any) {
  if (req.method === "GET") {
    const eventName = await db
      .collection("events")
      .findOne({ event: "ProposalCreated", chain: 80001 });

    res.status(200).json({ success: true, data: eventName });
  } else {
    // Handle any other HTTP method
  }
}
