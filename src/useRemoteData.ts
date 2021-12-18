import { initial, RemoteData } from "@devexperts/remote-data-ts";
import { ref, unref, watch, Ref } from "vue-demi";

export type Refable<T> = Ref<T> | T;
export type UnwrappedRefable<T> = T extends Refable<infer U> ? U : T;

/**
 * Return type of `usePromise()`
 */
export type UseRemoteData<E extends Error, A> = Ref<RemoteData<E, A>>;

/**
 * Returns the state of a Promise and observes the Promise if it's a Ref to
 * automatically update the state
 */
export function useRemoteData<E extends Error, A = unknown>(
  remoteData: Refable<RemoteData<E, A>>
): UseRemoteData<E, A> {
  const remoteDataRef = ref<RemoteData<any, any>>(initial);

  watch(
    () => unref(remoteData),
    (newRemoteData: UnwrappedRefable<typeof remoteData>) => {
      remoteDataRef.value = newRemoteData;
    },
    { immediate: true }
  );

  return remoteDataRef;
}
