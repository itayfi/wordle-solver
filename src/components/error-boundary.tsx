import { Component, PropsWithChildren, ReactNode } from "react";

export class ErrorBoundary extends Component<
  PropsWithChildren<{ fallback?: ReactNode }>,
  { isError: boolean }
> {
  state = { isError: false };

  static getDerivedStateFromError() {
    return { isError: true };
  }

  render() {
    if (this.state.isError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
