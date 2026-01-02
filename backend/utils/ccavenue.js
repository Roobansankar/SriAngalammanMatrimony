import nodeCCAvenue from "node-ccavenue";

const ccav = new nodeCCAvenue.Configure({
  merchant_id: process.env.CC_MERCHANT_ID,
  working_key: process.env.CC_WORKING_KEY,
});

export default ccav;
