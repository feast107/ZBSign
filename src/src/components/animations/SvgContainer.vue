<template>
    <div :style="`width:${width ?? 'unset'};height:${height ?? 'unset'}`">
        <svg viewBox="0 0 10000 6900" class="strokes" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <g fill="none" style="g">
                <path v-for="stroke in svgs" :key="stroke" :stroke-width="thick ?? 100" :d="stroke.p" class="backStroke"
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
import { Stroke } from '@/models/Stroke';
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
            } else {
                this.onRemoveStroke?.call(null, {
                    stroke: x,
                    fallback() { }
                });
            }
        })
    },
    methods: {
        remove(stroke){
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
        moveBy(stroke) {
            if (!this.isErasing) return;
            this.remove(stroke);
        },
        clean() {
            this.strokes.forEach(stroke => {
                this.remove(stroke);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.backStroke {
    stroke: transparent;
}
</style>