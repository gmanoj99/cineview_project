import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    label?: string;
}
interface State {
    hasError: boolean;
}

export class SectionBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Section crashed:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="state state--error">
                    {this.props.label ?? "This section failed to load."}
                </div>
            );
        }
        return this.props.children;
    }
}