function formatUniqId(CPT, payer) {
  return payer.split(" ").join("_") + "_" + CPT;
}

module.exports = { formatUniqId };
