export const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
  
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
  
        // Convert canvas to data URL
        const croppedImage = canvas.toDataURL('image/jpeg');
        resolve(croppedImage);
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  };