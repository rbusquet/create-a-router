import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { Route, Link, Redirect } from "../Router";

const pathGenerator = () => `/path_${Math.random().toString(36).substring(7)}`;

describe("Route", () => {
  test("doesn't render if unmatched path", () => {
    const path = pathGenerator();
    render(<Route path={path} component={() => <>Hello</>} />);
    expect(document.body).toHaveTextContent("");
  });
  test("renders immediately if the path matches", () => {
    const path = pathGenerator();
    history.pushState({}, "title", path);

    render(<Route path={path} component={() => <>Hello</>} />);
    expect(document.body).toHaveTextContent(/Hello/);
  });
});

describe("Link", () => {
  test("changes pathname on click", () => {
    const path = pathGenerator();
    render(<Link to={path}>Test</Link>);
    user.click(screen.getByRole("link", { name: /Test/ }));
    expect(document.location.pathname).toBe(path);
  });
  test("with replace=true, state is not preserved", async () => {
    const startPath = location.pathname;
    const path1 = pathGenerator();
    const path2 = pathGenerator();
    render(
      <>
        <Link to={path1}>Test1</Link>
        <Link to={path2} replace>
          Test2
        </Link>
      </>
    );
    user.click(screen.getByRole("link", { name: /Test1/ }));
    user.click(screen.getByRole("link", { name: /Test2/ }));

    history.back();
    await waitFor(() => {
      expect(location.pathname).toBe(startPath);
    });
  });
  test("with replace=false, state is not preserved", async () => {
    const path1 = pathGenerator();
    const path2 = pathGenerator();
    render(
      <>
        <Link to={path1}>Test1</Link>
        <Link to={path2}>Test2</Link>
      </>
    );
    user.click(screen.getByRole("link", { name: /Test1/ }));
    user.click(screen.getByRole("link", { name: /Test2/ }));

    history.back();
    await waitFor(() => {
      expect(location.pathname).toBe(path1);
    });
  });
});

describe("Redirect", () => {
  test("with push=true, render redirects to page keeping history", async () => {
    const startPath = pathGenerator();
    history.pushState({}, "", startPath);
    const path = pathGenerator();
    render(<Redirect to={path} push />);
    expect(location.pathname).toBe(path);
    history.back();
    await waitFor(() => expect(location.pathname).toBe(startPath));
  });
  test("with push=false, render redirects to page replacing history", async () => {
    const currentPath = location.pathname;
    history.pushState({}, "", pathGenerator());
    const path = pathGenerator();
    render(<Redirect to={path} push={false} />);
    expect(location.pathname).toBe(path);
    history.back();
    await waitFor(() => expect(location.pathname).toBe(currentPath));
  });
});
