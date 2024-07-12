export const getImageSize = (url) => {
  const img = document.createElement("img");
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () =>
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = reject;
  });
};
