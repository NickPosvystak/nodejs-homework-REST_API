module.exports = (validator) => (data) => {
  const { value, error } = validator(data);

  if (!error) return { value };

  console.log(error);

  return {
    value,
    error: error.details.map((err) => err.message),
  };
};
