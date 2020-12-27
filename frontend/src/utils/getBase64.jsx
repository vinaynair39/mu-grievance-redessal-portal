export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const blobsToBase64s = async (images) => {
  const promises = images.map(async (doc) => {
    const extension = doc.type === "image/jpeg" ? "jpg" : doc.type.split("/")[1];
    const data = await getBase64(doc);
    return {
      data,
      extension,
    };
  });
  return Promise.all(promises);
};
