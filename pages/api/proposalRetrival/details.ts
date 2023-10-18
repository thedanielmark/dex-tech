import { db } from "@/utilities/mongo";
import { numberToHex } from "viem";

export default async function read(req: any, res: any) {
  if (req.method === "GET") {
    let proposalId = req.query.proposalId;
    console.log("Proposal Id Raw:", proposalId);
    proposalId = numberToHex(proposalId);
    if (
      proposalId ==
      "0x2ad2455af58750dc4f76c2911e1540fe53ae46f9b8da05dc5d018586668ad89"
    ) {
      proposalId =
        "0x02ad2455af58750dc4f76c2911e1540fe53ae46f9b8da05dc5d018586668ad89";
    }

    let query = {
      args: {
        $in: [{ _hex: proposalId, _isBigNumber: true }],
      },
      event: "ProposalCreated",
    };

    console.log("Query:", query);

    const proposal = await db.collection("electra-events").findOne(query);

    console.log(proposal);

    const votes = await db
      .collection("electra-events")
      .find({
        args: {
          $in: [{ _hex: proposalId, _isBigNumber: true }],
        },
        event: "VoteCast",
      })
      .toArray();

    res.status(200).json({ success: true, proposal, votes });
  } else {
    // Handle any other HTTP method
  }
}
