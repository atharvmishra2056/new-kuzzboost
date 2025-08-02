import { useState } from "react";
import TawkChatModal from "./TawkChatModal";
import { Mail, MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";


interface ContactSupportDialogProps {
  children: React.ReactNode;
}

const ContactSupportDialog = ({ children }: ContactSupportDialogProps) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const { toast } = useToast();

  const supportEmail = "support@kuzzboost.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setEmailCopied(true);
      toast({
        title: "Email Copied!",
        description: "Support email has been copied to your clipboard.",
      });
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the email address.",
        variant: "destructive",
      });
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${supportEmail}`;
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Contact Support</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center text-sm text-muted-foreground mb-6">
            Need help? Our support team is here to assist you 24/7
          </div>
          
          {/* Email Support */}
          <div className="space-y-3">
            <Button
              onClick={handleEmailClick}
              className="w-full glass-button flex items-center justify-center gap-3 h-12"
            >
              <Mail className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Email Support</span>
                <span className="text-xs opacity-80">{supportEmail}</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyEmail}
              className="w-full flex items-center justify-center gap-2"
            >
              {emailCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Email Address</span>
                </>
              )}
            </Button>
          </div>

          {/* Chat Support */}
          <div className="space-y-3">
            <Button
              onClick={() => setChatModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 h-12 glass-button"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat With Us</span>
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground mt-6">
            We typically respond within 24 hours
          </div>
        </div>
      </DialogContent>
    </Dialog>
      <TawkChatModal isOpen={isChatModalOpen} onClose={() => setChatModalOpen(false)} />
    </>
  );
};

export default ContactSupportDialog;