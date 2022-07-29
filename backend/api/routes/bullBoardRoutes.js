import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { EventQueue, WebhookQueue, BookingQueue } from "../../queue/index.js";
import { createBullBoard } from "@bull-board/api";

// hello world example with bull board: https://github.com/felixmosh/bull-board#readme

// adapter to allow to use with express
const serverAdapter = new ExpressAdapter();

// create bull board
createBullBoard({
  queues: [
    new BullMQAdapter(EventQueue.queueInstance),
    new BullMQAdapter(WebhookQueue.queueInstance),
    new BullMQAdapter(BookingQueue.queueInstance),
  ],
  serverAdapter: serverAdapter,
});

// set path for bull board
serverAdapter.setBasePath("/admin/queues");

export default serverAdapter.getRouter();
