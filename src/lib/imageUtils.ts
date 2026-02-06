export async function convertImageToWebP(
  file: File,
  quality: number = 0.8
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Não foi possível criar o contexto do canvas'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Erro ao converter imagem'));
            return;
          }
          
          const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const newFile = new File([blob], newName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          
          resolve(newFile);
        },
        'image/webp',
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Erro ao carregar imagem para conversão'));
    };
    
    img.src = url;
  });
}