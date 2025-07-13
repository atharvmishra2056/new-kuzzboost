import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-4">Oops! Something went wrong.</h1>
                    <p className="text-muted-foreground mb-6">We encountered an error while loading this page. Please try again.</p>
                    <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;