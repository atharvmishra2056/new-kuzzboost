// src/components/ReviewModal.tsx

import { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

const reviewSchema = z.object({
    rating: z.number().min(1, { message: "Please select a rating." }),
    comment: z.string().min(10, { message: "Review must be at least 10 characters." }).max(500, { message: "Review cannot exceed 500 characters." }),
});

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    serviceId: number;
    serviceTitle: string;
    onReviewSubmitted: () => void;
}

export const ReviewModal = ({ isOpen, onClose, orderId, serviceId, serviceTitle, onReviewSubmitted }: ReviewModalProps) => {
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { rating: 0, comment: "" },
    });

    const handleSetRating = (rate: number) => {
        setRating(rate);
        form.setValue("rating", rate, { shouldValidate: true });
    };

    async function onSubmit(values: z.infer<typeof reviewSchema>) {
        if (!currentUser) {
            toast({ title: "Error", description: "You must be logged in to leave a review.", variant: "destructive"});
            return;
        }

        const { error } = await supabase.from('reviews').insert({
            service_id: serviceId,
            user_id: currentUser.id,
            order_id: orderId,
            rating: values.rating,
            comment: values.comment
        });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive"});
        } else {
            toast({ title: "Success", description: "Thank you for your review!"});
            onReviewSubmitted();
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass">
                <DialogHeader>
                    <DialogTitle>Write a review for {serviceTitle}</DialogTitle>
                    <DialogDescription>Your feedback helps other customers make informed decisions.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Your Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={cn("w-6 h-6 cursor-pointer transition-colors", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-300")}
                                                    onClick={() => handleSetRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Review</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us what you think about the service..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};