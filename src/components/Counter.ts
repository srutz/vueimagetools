import { defineComponent, h } from "vue";

export default defineComponent({
  name: "CounterOne",
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
  emits: {
    "update:count": (value: number) => typeof value === "number",
  },
  setup(props, { emit }) {
    const increment = () => {
      emit("update:count", props.count + 1);
    };

    return () =>
      h("div", [
        h("p", `Count: ${props.count}`),
        h("button", { onClick: increment }, "Increment"),
      ]);
  },
});
