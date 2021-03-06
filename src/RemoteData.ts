import * as RD from "@devexperts/remote-data-ts";
import {
  PropType,
  defineComponent,
  toRefs,
  AllowedComponentProps,
  ComponentCustomProps,
  VNodeProps,
  VNode,
  isVue3,
  warn,
} from "vue-demi";
import { UseRemoteData, useRemoteData } from "./useRemoteData";

export const RemoteDataImpl = defineComponent({
  name: "RemoteData",
  props: {
    remoteData: {
      required: true,
      type: Object as PropType<RD.RemoteData<unknown, unknown>>,
      validator: (
        prop: RD.RemoteData<unknown, unknown>
      ): prop is RD.RemoteData<unknown, unknown> =>
        RD.isFailure(prop) ||
        RD.isSuccess(prop) ||
        RD.isPending(prop) ||
        RD.isInitial(prop),
    },
  },
  setup(props, { slots }) {
    if (!props.remoteData)
      throw new Error(
        "(vue-remote-data) remote-data prop is required to make this component work."
      );

    const propsAsRefs = toRefs(props);
    const remoteData = useRemoteData(propsAsRefs.remoteData);

    return () => {
      ["initial", "pending", "failure", "success"].forEach(
        (slotName) =>
          !slots[slotName] &&
          (isVue3 ? warn : console.warn)(
            `(vue-remote-data) Missing slot "${slotName}" in RemoteData component. This will fail in production.`
          )
      );

      return RD.fold<unknown, unknown, VNode[]>(
        () => {
          if (!slots.initial)
            throw new Error('Missing slot "initial" in RemoteData component.');
          return slots.initial();
        },
        () => {
          if (!slots.pending)
            throw new Error('Missing slot "pending" in RemoteData component.');
          return slots.pending();
        },
        (failure) => {
          if (!slots.failure)
            throw new Error('Missing slot "failure" in RemoteData component.');
          return slots.failure(failure);
        },
        (success) => {
          if (!slots.success)
            throw new Error('Missing slot "success" in RemoteData component.');
          return slots.success(success);
        }
      )(remoteData.value);
    };
  },
});

export const RemoteData = RemoteDataImpl as unknown as {
  new (): {
    $props: AllowedComponentProps &
      ComponentCustomProps &
      VNodeProps & { remoteData: RD.RemoteData<unknown, unknown> };
  };

  $slots: {
    initial: () => VNode[];
    pending: () => VNode[];
    success: (success: unknown) => VNode[];
    failure: (error: unknown) => VNode[];
  };
};
