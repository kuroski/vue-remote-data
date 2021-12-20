import * as RD from "@devexperts/remote-data-ts";
import { render, screen } from "@testing-library/vue";
import { ref } from "vue-demi";
import { mockWarn } from "jest-mock-warn";
import { RemoteData } from "../RemoteData";

describe("RemoteData", () => {
  test("user sees all states of a remote data", async () => {
    const remoteData = ref<RD.RemoteData<Error, string>>(RD.initial);
    const view = render(RemoteData, {
      props: {
        remoteData,
      },
      slots: {
        initial: () => "Nothing asked yet",
        pending: () => "Loading...",
        success: (data: string) => data,
        failure: (error: Error) => error.message,
      },
    });

    expect(screen.getByText("Nothing asked yet")).toBeInTheDocument();

    remoteData.value = RD.pending;
    await view.rerender({ remoteData });

    expect(screen.queryByText("Nothing asked yet")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    remoteData.value = RD.success("Hello world");
    await view.rerender({ remoteData });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();

    remoteData.value = RD.failure(new Error("Oops, something went wrong"));
    await view.rerender({ remoteData });

    expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
    expect(screen.getByText("Oops, something went wrong")).toBeInTheDocument();
  });

  mockWarn();

  it("throws an error if no remoteData provided", () => {
    expect(() => render(RemoteData)).toThrowErrorMatchingInlineSnapshot(
      `"(vue-remote-data) remote-data prop is required to make this component work."`
    );

    expect(
      '[Vue warn]: Missing required prop: "remoteData"'
    ).toHaveBeenWarned();
    expect(
      "[Vue warn]: Unhandled error during execution of setup function"
    ).toHaveBeenWarned();
  });

  it("warns on missing slots", () => {
    const remoteData = ref<RD.RemoteData<Error, string>>(RD.initial);

    expect(() =>
      render(RemoteData, { props: { remoteData } })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing slot \\"initial\\" in RemoteData component."`
    );

    expect(
      '(vue-remote-data) Missing slot "initial" in RemoteData component. This will fail in production.'
    ).toHaveBeenWarned();
    expect(
      '(vue-remote-data) Missing slot "pending" in RemoteData component. This will fail in production.'
    ).toHaveBeenWarned();
    expect(
      '(vue-remote-data) Missing slot "failure" in RemoteData component. This will fail in production.'
    ).toHaveBeenWarned();
    expect(
      '(vue-remote-data) Missing slot "success" in RemoteData component. This will fail in production.'
    ).toHaveBeenWarned();
    expect(
      "[Vue warn]: Unhandled error during execution of render function"
    ).toHaveBeenWarned();
  });
});
