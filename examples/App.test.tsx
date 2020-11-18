import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "./App";

test("navidate through app", () => {
  render(<App />);
  user.click(screen.getByRole("link", { name: /home/i }));
  expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();

  user.click(screen.getByRole("link", { name: /about/i }));
  expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();

  user.click(screen.getByRole("link", { name: /topics/i }));
  expect(screen.getByRole("heading", { name: /topics/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /please select a topic/i })
  ).toBeInTheDocument();

  user.click(screen.getByRole("link", { name: /rendering with react/i }));
  expect(
    screen.getByRole("heading", { name: /rendering with react/i })
  ).toBeInTheDocument();

  user.click(screen.getByRole("link", { name: /components/i }));
  expect(
    screen.getByRole("heading", { name: /components/i })
  ).toBeInTheDocument();

  user.click(screen.getByRole("link", { name: /props v\. state/i }));
  expect(
    screen.getByRole("heading", { name: /props v\. state/i })
  ).toBeInTheDocument();
});
