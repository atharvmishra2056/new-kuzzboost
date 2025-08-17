import { useEffect, useState } from 'react';

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    return !!gl;
  } catch (e) {
    return false;
  }
}

export const useWebGLCapable = () => {
  const [capable, setCapable] = useState<boolean>(true);

  useEffect(() => {
    // Avoid SSR issues
    if (typeof window === 'undefined') {
      setCapable(false);
      return;
    }
    setCapable(checkWebGLSupport());
  }, []);

  return capable;
};
