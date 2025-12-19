onmessage = async (e) => {
  const { image, maxWidth = 800, maxHeight = 800 } = e.data;

  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const width = image.width * ratio;
  const height = image.height * ratio;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0, width, height);

  const blob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: 0.9,
  });

  // const filename = `snapshot_${new Date().toISOString()}.jpg`;
  // const driverImage = new File([blob], filename, {
  //   type: "image/jpeg",
  // });

  postMessage(blob);
  image.close?.();
};
