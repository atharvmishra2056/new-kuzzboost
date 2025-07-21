import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FeedbackDialogProps {
  children: React.ReactNode;
}

const FeedbackDialog = ({ children }: FeedbackDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Give Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-peach/20 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-accent-peach" />
            </div>
            <h3 className="font-semibold text-primary mb-2">Feature Coming Soon!</h3>
            <p className="text-sm text-muted-foreground">
              We're working on an amazing feedback system to help us serve you better.
            </p>
          </div>

          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-6 h-6 text-muted-foreground opacity-30"
              />
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            In the meantime, feel free to reach out to our support team with any suggestions or feedback!
          </div>

          <Button
            onClick={() => setIsOpen(false)}
            className="w-full"
            variant="outline"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;