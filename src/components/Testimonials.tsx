import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
    {
        name: "Aisha Sharma",
        handle: "@aisha_designs",
        text: "KuzzBoost completely transformed my Instagram presence. The growth was organic and the support team was fantastic. Highly recommended!",
        rating: 5,
    },
    {
        name: "Rohan Verma",
        handle: "@rohanvlogs",
        text: "As a YouTuber, getting those initial views is tough. KuzzBoost gave me the exact boost I needed to get my videos noticed by the algorithm.",
        rating: 5,
    },
    {
        name: "Priya Singh",
        handle: "MusicByPriya",
        text: "My Spotify playlist followers have doubled! This service is legit and has helped my music reach a wider audience.",
        rating: 5,
    },
    {
        name: "Ankit Gupta",
        handle: "@gamerankit",
        text: "Needed followers to hit Twitch Affiliate and KuzzBoost delivered in less than a day. Super fast and reliable service.",
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-6">
                    Loved by Creators Everywhere
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                    Don't just take our word for it. Here's what some of our happy customers have to say.
                </p>

                <Carousel opts={{ loop: true }} className="w-full">
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card className="glass">
                                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                                            <div className="flex">
                                                {Array(testimonial.rating).fill(0).map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-accent-peach text-accent-peach" />
                                                ))}
                                            </div>
                                            <p className="text-lg text-foreground italic">"{testimonial.text}"</p>
                                            <div className="text-center">
                                                <p className="font-semibold text-primary">{testimonial.name}</p>
                                                <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    );
};

export default Testimonials;