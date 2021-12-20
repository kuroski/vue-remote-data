# vue-remote-data

Handle [RemoteData](https://github.com/devexperts/remote-data-ts) with Vue components.

## Installation

```sh
npm install vue-remote-data
# or
yarn add vue-remote-data
# or
pnpm install vue-remote-data
```

This project exposes a Vue component to deal with RemoteData, so you also have to install

```sh
pnpm install @devexperts/remote-data-ts
```

If you are using Vue 2, you also need to install `@vue/composition-api`:

```sh
pnpm install @vue/composition-api
```

## Usage

### Component

Vue Remote Data exposes a component named `RemoteData`, and each slots represents a possible state of a RemoteData:

```vue
<template>
  <RemoteData :remote-data="userRemoteData">
    <template v-slot:initial>
      <!-- or: <template #initial> -->
      <p>Nothing happened yet!</p>
    </template>

    <template v-slot:pending>
      <!-- or: <template #pending> -->
      <p>Loading...</p>
    </template>

    <template v-slot:failure="error">
      <!-- or: <template #failure="error"> -->
      <p>Oops: {{ error.message }}</p>
    </template>

    <template v-slot:success="user">
      <!-- or: <template #success="user"> -->
      <p>Welcome {{ user.name }}</p>
    </template>
  </RemoteData>
</template>

<script>
import * as RD from "@devexperts/remote-data-ts";

export default {
  data: () => ({
    userRemoteData: RD.initial,
  }),
  async created() {
    this.userRemoteData = RD.pending;
    this.userRemoteData = await this.getUser()
      .then(RD.success)
      .catch(RD.failure);
  },
};
</script>
```

## API Reference

### `RemoteData` component

`RemoteData` will watch its prop `remote-data` and change its state accordingly.

#### props

| Name         | Description               | Type         |
| ------------ | ------------------------- | ------------ |
| `remoteData` | RemoteData to be resolved | `RemoteData` |

#### slots

| Name      | Description                                                          | Scope                   |
| --------- | -------------------------------------------------------------------- | ----------------------- |
| `initial` | Content to display before anything happens                           | -                       |
| `pending` | Content to display while RemoteData is pending                       | -                       |
| `failure` | Content to display if the RemoteData failed                          | `error`: Failure reason |
| `success` | Content to display once the RemoteData has been successfully handled | `data`: Resulting data  |

## License

[MIT](http://opensource.org/licenses/MIT)
