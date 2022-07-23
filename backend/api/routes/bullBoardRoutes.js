import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { eventQueue, webhookQueue } from "../../queue/index.js";
import { createBullBoard } from "@bull-board/api";

// adapter to allow to use with express
const serverAdapter = new ExpressAdapter();

// create bull board
createBullBoard({
  queues: [new BullMQAdapter(eventQueue), new BullMQAdapter(webhookQueue)],
  serverAdapter: serverAdapter,
});

// set path for bull board
serverAdapter.setBasePath("/admin/queues");

export default serverAdapter.getRouter();
