import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unexpected UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fatal-error">
          <div className="fatal-error__card">
            <span className="state-card__icon" aria-hidden="true">
              <i className="fa-solid fa-triangle-exclamation" />
            </span>
            <h1>Something went wrong</h1>
            <p>
              The app hit an unexpected error. Reload the page to start fresh —
              your saved cities and preferences are kept.
            </p>
            <button
              type="button"
              className="btn-accent"
              onClick={() => window.location.reload()}
            >
              <i className="fa-solid fa-rotate-right" aria-hidden="true" />
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
