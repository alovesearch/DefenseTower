// js/utils/loader.js
export async function loadAssets(urls = []) {
  const promises = urls.map(
    (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      })
  );
  return Promise.all(promises);
}
