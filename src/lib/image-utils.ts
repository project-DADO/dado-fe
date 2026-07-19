export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

export async function dataUrlToFile(
  dataUrl: string,
  filename = "drawing.png",
): Promise<File> {
  const blob = await dataUrlToBlob(dataUrl);
  return new File([blob], filename, { type: blob.type || "image/png" });
}
