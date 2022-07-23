import Queue from "bull";

const bookingsQueue = new Queue("bookingsQueue",{
  redis: { host: "", port: 5454 }
});

/*const main = async () => {
  await bookingsQueue.add();
};*/

bookingsQueue.process((job, done) => {
  console.log(job.data);
  done();
});

module.exports = { bookingsQueue };

// main().catch(console.error);