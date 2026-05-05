export const formatDate = (isoDate) => {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(isoDate));
  } catch {
    return "";
  }
};
