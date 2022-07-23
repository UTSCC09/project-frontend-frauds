import Queue from "bull";

const registrationQueue = new Queue("registrationQueue",{
    redis: { host: "", port: 5454 }
});

/*const main = async () => {
    await registrationQueue.add();
};*/

registrationQueue.process((job, done) => {
    console.log(job.data);
    done();
});

module.exports = { registrationQueue };

/*
main().catch(console.error);*/
