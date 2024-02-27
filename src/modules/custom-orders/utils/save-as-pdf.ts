export const saveAsPDF = (data: string) => {
  const buffer = Buffer.from(data, "base64");
  const blob = new Blob([buffer]);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "invoice.pdf";
  link.click();
};
