"use client";

import { Component, ReactNode } from "react";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

interface LottieErrorBoundaryProps {
  children: ReactNode;
}

interface LottieErrorBoundaryState {
  hasError: boolean;
}

class LottieErrorBoundary extends Component<LottieErrorBoundaryProps, LottieErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Lottie animation failed. Rendering fallback instead.", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          aria-hidden
          style={{
            height: 120,
            width: 120,
          }}
        />
      );
    }

    return this.props.children;
  }
}

const LottieClient = (props: any) => (
  <LottieErrorBoundary>
    <Lottie
      {...props}
      eventListeners={props.eventListeners ?? []}
    />
  </LottieErrorBoundary>
);

export default LottieClient;
