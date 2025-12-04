
export interface UploadResponse {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}


export async function uploadImage(
  file: File,
  folder?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer upload');
  }

  return response.json();
}


export async function deleteImage(url: string): Promise<void> {
  const response = await fetch(
    `/api/upload/delete?url=${encodeURIComponent(url)}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao deletar imagem');
  }
}


export async function uploadMultipleImages(
  files: File[],
  folder?: string
): Promise<UploadResponse[]> {
  const uploads = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploads);
}
