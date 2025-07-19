import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CursorFollower = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable elements
            const target = e.target as HTMLElement;
            const isClickable = target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsPointer(!!isClickable);
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
        <>
            {/* Main cursor */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] opacity-80"
                animate={{
                    x: mousePosition.x - 8, // Adjust to center the cursor
                    y: mousePosition.y - 8, // Adjust to center the cursor
                    scale: isPointer ? 1.5 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5
                }}
                style={{ backgroundColor: 'seagreen', mixBlendMode: 'difference' }}
            />

            {/* Trailing cursor */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border-2 border-accent-peach rounded-full pointer-events-none z-[9998] opacity-60"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isPointer ? 2 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.8
                }}
            />

            {/* Glow effect */}
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 bg-gradient-vibrant rounded-full pointer-events-none z-[9997] opacity-20 blur-md"
                animate={{
                    x: mousePosition.x - 24,
                    y: mousePosition.y - 24,
                    scale: isPointer ? 1.8 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1
                }}
            />
        </>
    );
};

export default CursorFollower;
