// Simple hook to interact with Tawk.to widget
// Provides a function to open (maximize) the chat programmatically
// Usage: const { openChat } = useTawk(); openChat();

const useTawk = () => {
  const DIRECT_CHAT_LINK = "https://tawk.to/chat/687f9fdc1786aa1911e6fb9f/1j0p8gtn5";
  const openChat = () => {
    try {
      // @ts-ignore - Tawk_API injected globally by script
      if (window && (window as any).Tawk_API && typeof (window as any).Tawk_API.maximize === 'function') {
        (window as any).Tawk_API.maximize();
      }
    } catch (e) {
      // Fallback: open direct chat link in new tab
      window.open(DIRECT_CHAT_LINK, "_blank");
    }
  };

  return { openChat };
};

export default useTawk;
