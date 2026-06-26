import { useEffect, useState } from "react";

export type AsyncState<T> =
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };

export function useAsync<T>(
    fn: () => Promise<T>,
    deps: unknown[]
): AsyncState<T> {
    const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

    useEffect(() => {
        let active = true;
        setState({ status: "loading" });
        fn()
            .then((data) => {
                if (active) {
                    setState({ status: "success", data });
                }
            })
            .catch((error: unknown) => {
                if (active) {
                    setState({
                        status: "error",
                        error:
                            error instanceof Error
                                ? error
                                : new Error("Unknown error"),
                    });
                }
            });
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return state;
}