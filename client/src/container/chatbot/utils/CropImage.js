export const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    console.log("getCroppedImg called with:", { 
      imageSrcLength: imageSrc.length, 
      imageSrcType: typeof imageSrc,
      croppedAreaPixels 
    });
  
    return new Promise((resolve, reject) => {
      try {
        // Create image first
        const image = new Image();
        
        // Set crossOrigin to anonymous for canvas security
        image.crossOrigin = 'anonymous';
        
        // Set up onload handler BEFORE setting src
        image.onload = () => {
          console.log("Image loaded successfully, dimensions:", image.width, "x", image.height);
          
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to cropped area
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            
            console.log("Canvas created with dimensions:", canvas.width, "x", canvas.height);
            
            // Draw the cropped image
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
            
            console.log("Image drawn to canvas, converting to data URL");
            
            // Convert canvas to data URL
            const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
            console.log("Data URL created, length:", croppedImage.length);
            
            resolve(croppedImage);
          } catch (drawError) {
            console.error("Error drawing image to canvas:", drawError);
            reject(drawError);
          }
        };
        
        // Set up error handler
        image.onerror = (error) => {
          console.error("Image load error:", error);
          reject(new Error("Failed to load image"));
        };
        
        // Set the source last (important!)
        image.src = imageSrc;
        
        // Also check if image is already loaded (happens with cached images)
        if (image.complete) {
          console.log("Image already loaded (cached), triggering onload");
          image.onload();
        }
      } catch (error) {
        console.error("Error in getCroppedImg:", error);
        reject(error);
      }
    });
  };