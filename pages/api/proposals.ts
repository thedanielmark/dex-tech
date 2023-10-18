import { db } from "@/utilities/mongo";
import { numberToHex } from "viem";

export default async function read(req: any, res: any) {
  if (req.method === "GET") {
    const proposals = await db
      .collection("electra-events")
      .find({
        event: "ProposalCreated",
      })
      .toArray();

    res.status(200).json({ success: true, proposals });
  } else {
    // Handle any other HTTP method
  }
}
