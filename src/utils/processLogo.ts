import { removeBackground, loadImageFromUrl } from '@/lib/background-removal';
import logoUrl from '@/assets/livestatz-logo-new.png';

export const processLogoBackground = async () => {
  try {
    console.log('Loading logo...');
    const img = await loadImageFromUrl(logoUrl);
    console.log('Logo loaded, removing background...');
    const processedBlob = await removeBackground(img);
    console.log('Background removed successfully');
    
    // Create a download link for the processed image
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'livestatz-logo-transparent.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return processedBlob;
  } catch (error) {
    console.error('Error processing logo:', error);
    throw error;
  }
};
