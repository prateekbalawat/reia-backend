function calculateROI(initial, rate, years = 5) {
  let value = initial;
  const projection = [];

  for (let year = 1; year <= years; year++) {
    value *= 1 + rate;
    projection.push({
      year,
      estimated_value: Math.round(value),
    });
  }

  return projection;
}

module.exports = {
  calculateROI,
};
