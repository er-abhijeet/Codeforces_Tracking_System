const toPostgresInsertValues = (data,handle) => {
  return data.map(d => (
    `(${d.contestId}, ` +
    `'${d.contestName.replace(/'/g, "''")}', ` +
    `TO_TIMESTAMP(${d.ratingUpdateTimeSeconds}), ` +
    `${d.oldRating}, ${d.newRating}, `+
    `'${handle}')`
  )).join(",\n");
};

export default toPostgresInsertValues;