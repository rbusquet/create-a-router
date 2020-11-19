import type { ComponentType, ReactElement } from "react";

export interface ComponentProps {
  match: Match;
}
export interface Match {
  url: string;
  path: string | null;
  isExact: boolean;
}
export interface Options {
  path?: string;
  exact?: boolean;
}
export interface RouteProps extends Options {
  component?: ComponentType<ComponentProps>;
  render?(props: ComponentProps): ReactElement;
}
export interface LinkProps {
  to: string;
  replace?: boolean;
}
export interface RedirectProps {
  to: string;
  push: boolean;
}
