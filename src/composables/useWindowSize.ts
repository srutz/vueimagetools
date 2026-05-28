
import { onMounted, onUnmounted, ref } from 'vue';

export function useWindowSize() {

    const size = ref({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const listener = () => {
        size.value = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    onMounted(() => {
        window.addEventListener("resize", listener);
    })
    onUnmounted(() => {
        window.removeEventListener("resize", listener);   
    })
    return size;
}