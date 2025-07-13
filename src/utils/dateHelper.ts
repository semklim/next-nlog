export const getTime = (date: string) => {
  try {
    return new Date(date).getTime();
  } catch (error) {
    console.error(error);
    return 0;
  }
};
