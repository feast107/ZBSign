<template>
    <div :style="`width:${width ?? 'unset'};height:${height ?? 'unset'}`">
        <svg viewBox="0 0 10000 6900" class="strokes" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <g fill="none" style="g">
                <path v-for="stroke in svgs" :key="stroke" :stroke-width="thick ?? 100" :d="stroke.p" stroke="lightblue"
                    @mouseenter="() => { this.moveBy(stroke) }">
                </path>
                <path v-for="stroke in svgs" :key="stroke" :d="stroke.p" :stroke="stroke.c" stroke-width="10">
                </path>
            </g>
        </svg>
    </div>
</template>

<script>
import { ComponentKey } from '@/utils/Definition';
import { Stroke } from '@/utils/Stroke';
export default {
    inject: [ComponentKey.ModifingActivity],
    props: ['strokes', 'width', 'height', 'isErasing', 'onRemoveStroke', 'thick'],
    data() {
        return {
            activity: this[ComponentKey.ModifingActivity],
            regions: [],
            /**
             * @type {Stroke[]}
             */
            svgs: [],
            removed: [],
        }
    },
    created() {
        this.strokes.forEach(x => {
            if (x.p.split(' ').length > 2) {
                this.svgs.add(x);
            }
        })
    },
    unmounted() { },
    methods: {
        removeStroke(stroke) {
            //console.log(stroke);
        },
        moveBy(stroke) {
            if (!this.isErasing) return;
            this.svgs.remove(stroke);
            this.removed.add(stroke);
            let vue = this;
            let removed = true;
            this.onRemoveStroke?.call(null, {
                stroke: stroke,
                fallback() {
                    if (removed) {
                        vue.removed.remove(stroke);
                        vue.svgs.add(stroke)
                    }
                    removed = false;
                }
            });
        },
    }
}
</script>

<style lang="scss"></style>