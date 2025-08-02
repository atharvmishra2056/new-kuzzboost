import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TawkChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TawkChatModal = ({ isOpen, onClose }: TawkChatModalProps) => {
  const chatUrl = "https://tawk.to/chat/687f9fdc1786aa1911e6fb9f/1j0p8gtn5";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 m-0 max-w-lg h-[70vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Live Chat</DialogTitle>
        </DialogHeader>
        <div className="flex-grow">
          <iframe
            src={chatUrl}
            className="w-full h-full border-0"
            title="Tawk.to Live Chat"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TawkChatModal;
