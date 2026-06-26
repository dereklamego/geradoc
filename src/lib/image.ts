const MAX_DIMENSION = 500;
const QUALITY = 0.8;
const MAX_BYTES = 300 * 1024;

export async function compressToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);

            const base64 = canvas.toDataURL('image/jpeg', QUALITY);
            const bytes = Math.round((base64.length - 'data:image/jpeg;base64,'.length) * 3 / 4);

            if (bytes > MAX_BYTES) {
                reject(new Error(`Imagem ainda ocupa ${Math.round(bytes / 1024)} KB após compressão. Tente uma imagem menor.`));
            } else {
                resolve(base64);
            }
        };

        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Falha ao carregar imagem.')); };
        img.src = url;
    });
}
