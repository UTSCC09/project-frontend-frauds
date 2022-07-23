// processor for sandboxed job
module.exports = async (job) => {
  console.log(job);
  return "done";
};
