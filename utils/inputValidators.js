const isEmpty = (value) => value.trim() === "";

function validateEmptyInputs(inputValues) {
  return Object.keys(inputValues).reduce((acc, key) => {
    return isEmpty(inputValues[key])
      ? {
          ...acc,
          [key]: `${key.toUpperCase()} cannot be empty`,
        }
      : acc;
  }, {});
}

function validateInput(inputValues) {
  const errors = validateEmptyInputs(inputValues);

  const valid = Object.keys(errors).length === 0;
  return { errors, valid };
}

module.exports = { validateInput };
