import Queue from "bull";

const queue = new Queue("myQueue");

const main = async () => {
  await queue.add({ name: "John", age: 30 });
};

queue.process((job, done) => {
  console.log(job.data);
  done();
});

main().catch(console.error);