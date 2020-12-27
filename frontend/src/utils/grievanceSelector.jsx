export default (grievances, { text }) => {
  return grievances.filter((grievance) => {
    const textMatch = grievance.title.toLowerCase().includes(text.toLowerCase());
    return textMatch;
  });
};
