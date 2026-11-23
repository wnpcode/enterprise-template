import { Component, Suspense, type ReactNode } from "react";
import { Spinner } from "@enterprise/design-system";
import { Outlet, useLocation, useOutletContext } from "react-router";
import { ErrorPage } from "./ErrorPage";

type Props = { children: ReactNode; resetKey: string };
type State = { error: Error | null };

class Boundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    return this.state.error ? <ErrorPage error={this.state.error} /> : this.props.children;
  }
}

// route tanpa path di dalam tiap layout: halaman yang melempar error diganti ErrorPage, shell tetap tampil;
// pulih otomatis saat pengguna pindah halaman. Context dari layout induk diteruskan agar useOutletContext tetap bekerja.
// Suspense di sini menampung halaman yang dimuat lazy (lihat routes.tsx) tanpa mengganti shell.
export function RouteErrorBoundary() {
  const { pathname } = useLocation();
  const context = useOutletContext();
  return (
    <Boundary resetKey={pathname}>
      <Suspense
        fallback={
          <div className="min-h-40 flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <Outlet context={context} />
      </Suspense>
    </Boundary>
  );
}
