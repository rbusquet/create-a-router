import type { MutableRefObject, MouseEvent, FC } from "react";
import { useState, useRef, useEffect, createElement } from "react";
import type {
  Options,
  Match,
  RouteProps,
  LinkProps,
  RedirectProps,
} from "./types";

function matchPath(pathname: string, options: Options): Match | null {
  const { exact = false, path } = options;
  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
    };
  }
  const match = new RegExp(`^${path}`).exec(pathname);
  if (!match) return null;
  const url = match[0];
  const isExact = pathname === url;

  if (exact && !isExact) {
    // There was a match, but it wasn't
    // an exact match as specified by
    // the exact prop.

    return null;
  }

  return {
    path,
    url,
    isExact,
  };
}

const instances: MutableRefObject<{ forceUpdate(): void }>[] = [];

const register = (comp: MutableRefObject<{ forceUpdate(): void }>) =>
  instances.push(comp);
const unregister = (comp: MutableRefObject<{ forceUpdate(): void }>) =>
  instances.splice(instances.indexOf(comp), 1);

export const Route: FC<RouteProps> = ({ path, exact, component, render }) => {
  const [pathname, setPathName] = useState(() => window.location.pathname);

  const ref = useRef({
    forceUpdate() {
      setPathName(window.location.pathname);
    },
  });

  useEffect(() => {
    register(ref);
    return () => {
      unregister(ref);
    };
  });

  useEffect(() => {
    const handler = () => {
      setPathName(window.location.pathname);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  });

  const match = matchPath(pathname, { path, exact });
  if (!match) {
    return null;
  }
  if (component) return createElement(component, { match });
  if (render) return render({ match });
  return null;
};

const historyPush = (path: string) => {
  history.pushState({}, "title", path);
  instances.forEach((instance) => instance.current.forceUpdate());
};

const historyReplace = (path: string) => {
  history.replaceState({}, "title", path);
  instances.forEach((instance) => instance.current.forceUpdate());
};

export const Link: FC<LinkProps> = ({ replace = false, to, children }) => {
  function handleClick(ev: MouseEvent<HTMLAnchorElement>) {
    ev.preventDefault();
    replace ? historyReplace(to) : historyPush(to);
  }
  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export const Redirect: FC<RedirectProps> = ({ to, push }) => {
  useEffect(() => {
    push ? historyPush(to) : historyReplace(to);
  });
  return null;
};
