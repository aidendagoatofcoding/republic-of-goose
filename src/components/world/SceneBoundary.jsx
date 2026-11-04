import { Component } from 'react';

// If a realm or an interior fails to draw, the player is offered the way back instead of
// being left on a blank black screen.
export default class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-3 bg-[#0a0f0b] p-6 text-center">
        <p className="font-display text-xl text-[#f6ecc9]">The way is shut</p>
        <p className="max-w-sm text-[13px] leading-relaxed text-[#a9b59c]">
          Something went wrong beyond the portal. Step back through and try again.
        </p>
        <button
          type="button"
          onClick={() => {
            this.setState({ failed: false });
            this.props.onReset?.();
          }}
          className="border-2 border-[#c2ff85]/60 bg-[#c2ff85]/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c2ff85] hover:bg-[#c2ff85]/25"
        >
          Back to the Commons
        </button>
      </div>
    );
  }
}