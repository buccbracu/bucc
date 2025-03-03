const generateSemesters = () => {
  const options = [];
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= currentYear - 10; year--) {
    options.push(`Spring ${year}`);
    options.push(`Summer ${year}`);
    options.push(`Fall ${year}`);
  }

  return options;
};

export default generateSemesters;
