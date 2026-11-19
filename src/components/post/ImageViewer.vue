<template>
    <q-dialog
        :model-value="modelValue"
        maximized
        transition-show="fade"
        transition-hide="fade"
        @update:model-value="$emit('update:modelValue', $event)"
        @show="onShow"
        @hide="onHide"
    >
        <div class="md-viewer" @wheel.prevent="onWheel" @click.self="close">
            <img
                v-if="current"
                :key="current.src"
                :src="current.src"
                :alt="current.alt"
                :style="imgStyle"
                class="md-viewer__img"
                referrerpolicy="no-referrer"
                draggable="false"
                @mousedown.prevent="startDrag"
            >

            <template v-if="images.length > 1">
                <q-btn class="md-viewer__nav md-viewer__nav--prev" round unelevated color="grey-9" icon="chevron_left" @click="prev" />
                <q-btn class="md-viewer__nav md-viewer__nav--next" round unelevated color="grey-9" icon="chevron_right" @click="next" />
            </template>

            <div class="md-viewer__bar row items-center no-wrap q-gutter-x-xs">
                <span v-if="images.length > 1" class="q-px-sm">{{ index + 1 }} / {{ images.length }}</span>
                <q-btn flat round dense icon="zoom_out" @click="zoom(-0.2)" />
                <q-btn flat round dense icon="zoom_in" @click="zoom(0.2)" />
                <q-btn flat round dense :icon="contain ? 'fullscreen' : 'fullscreen_exit'" @click="toggleMode" />
                <q-btn flat round dense icon="rotate_left" @click="rotate(-90)" />
                <q-btn flat round dense icon="rotate_right" @click="rotate(90)" />
            </div>

            <q-btn class="md-viewer__close" round unelevated color="grey-9" icon="close" @click="close" />
        </div>
    </q-dialog>
</template>

<script>
const initialTransform = () => ({ scale: 1, deg: 0, offsetX: 0, offsetY: 0 });

/**
 * Full-screen viewer for the images of a post: previous/next, zoom
 * (buttons, mouse wheel, up/down keys), rotate, drag to pan, Esc to close.
 */
export default {
    name: "ImageViewer",
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        images: {
            type: Array, // { src, alt }
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        }
    },
    emits: ["update:modelValue", "update:index"],
    data() {
        return {
            contain: true,
            transform: initialTransform()
        };
    },
    computed: {
        current() {
            return this.images[this.index] || null;
        },
        imgStyle() {
            const { scale, deg, offsetX, offsetY } = this.transform;
            const style = {
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${deg}deg)`
            };
            if (this.contain) {
                style.maxWidth = style.maxHeight = "100%";
            }
            return style;
        }
    },
    watch: {
        index() {
            this.reset();
        }
    },
    beforeUnmount() {
        this.onHide();
    },
    methods: {
        close() {
            this.$emit("update:modelValue", false);
        },
        reset() {
            this.transform = initialTransform();
        },
        prev() {
            if (this.images.length < 2) return;
            this.$emit("update:index", (this.index - 1 + this.images.length) % this.images.length);
        },
        next() {
            if (this.images.length < 2) return;
            this.$emit("update:index", (this.index + 1) % this.images.length);
        },
        zoom(delta) {
            const scale = this.transform.scale * (1 + delta);
            this.transform.scale = Math.min(Math.max(scale, 0.2), 8);
        },
        rotate(deg) {
            this.transform.deg += deg;
        },
        toggleMode() {
            this.contain = !this.contain;
            this.reset();
        },
        onWheel(ev) {
            this.zoom(ev.deltaY < 0 ? 0.1 : -0.1);
        },
        onKeydown(ev) {
            switch (ev.key) {
            case "ArrowLeft": this.prev(); break;
            case "ArrowRight": this.next(); break;
            case "ArrowUp": this.zoom(0.2); break;
            case "ArrowDown": this.zoom(-0.2); break;
            case " ": this.toggleMode(); break;
            default: return;
            }
            ev.preventDefault();
        },
        startDrag(ev) {
            if (ev.button !== 0) return;
            const { offsetX, offsetY } = this.transform;
            const startX = ev.pageX;
            const startY = ev.pageY;
            const move = (e) => {
                this.transform.offsetX = offsetX + e.pageX - startX;
                this.transform.offsetY = offsetY + e.pageY - startY;
            };
            const stop = () => {
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", stop);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", stop);
        },
        onShow() {
            this.contain = true;
            this.reset();
            document.addEventListener("keydown", this.onKeydown);
        },
        onHide() {
            document.removeEventListener("keydown", this.onKeydown);
        }
    }
};
</script>

<style lang="scss">
.md-viewer {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;

    &__img {
        cursor: grab;
        user-select: none;
        transition: transform 0.15s;
    }

    &__nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &--prev {
            left: 16px;
        }
        &--next {
            right: 16px;
        }
    }

    &__close {
        position: absolute;
        top: 16px;
        right: 16px;
    }

    &__bar {
        position: absolute;
        bottom: 24px;
        left: 50%;
        padding: 4px 12px;
        border-radius: 22px;
        background: rgba(60, 60, 60, 0.9);
        transform: translateX(-50%);
    }
}
</style>
