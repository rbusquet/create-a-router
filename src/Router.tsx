import React from "react";

interface Match {
  url: string;
  path: string | null;
  isExact: boolean;
}

interface Options {
  path?: string;
  exact?: boolean;
}

interface ComponentProps {
  match: Match;
}

interface RouteProps extends Options {
  component?: React.ComponentType<ComponentProps>;
  render?(props: ComponentProps): React.ReactElement;
}

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

let instances: React.MutableRefObject<{ forceUpdate(): void }>[] = [];

const register = (comp: React.MutableRefObject<{ forceUpdate(): void }>) =>
  instances.push(comp);
const unregister = (comp: React.MutableRefObject<{ forceUpdate(): void }>) =>
  instances.splice(instances.indexOf(comp), 1);

export function Route({ path, exact, component, render }: RouteProps) {
  const [pathname, setPathName] = React.useState(
    () => window.location.pathname
  );

  const ref = React.useRef({
    forceUpdate() {
      setPathName(window.location.pathname);
    },
  });

  React.useEffect(() => {
    register(ref);
    return () => {
      unregister(ref);
    };
  });

  React.useEffect(() => {
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
  if (component) return React.createElement(component, { match });
  if (render) return render({ match });
  return null;
}

interface LinkProps {
  to: string;
  replace?: boolean;
}

interface RedirectProps {
  to: string;
  push: boolean;
}

const historyPush = (path: string) => {
  history.pushState({}, "title", path);
  instances.forEach((instance) => instance.current.forceUpdate());
};

const historyReplace = (path: string) => {
  history.replaceState({}, "title", path);
  instances.forEach((instance) => instance.current.forceUpdate());
};

export function Link({
  replace,
  to,
  children,
}: React.PropsWithChildren<LinkProps>) {
  function handleClick(ev: React.MouseEvent<HTMLAnchorElement>) {
    ev.preventDefault();
    replace ? historyReplace(to) : historyPush(to);
  }
  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}

export function Redirect({ to, push }: React.PropsWithChildren<RedirectProps>) {
  React.useEffect(() => {
    push ? historyPush(to) : historyReplace(to);
  });
  return null;
}
