<template>
  <div id="PlayMain">
    <div id="Foreground">
      <el-container id="Container">
        <el-header style="height: 20%">
          <el-row>
            <el-col :span="3">
              <el-image
                v-if="activity.HasLogo"
                class="logo"
                fit="cover"
                :src="activity.logoUrl"
              />
            </el-col>
            <el-col :span="21">
              <el-row>
                <el-popover
                  placement="bottom"
                  :width="200"
                  trigger="contextmenu"
                >
                  <div style="width: 200px">
                    <el-row>
                      <el-color-picker
                        v-model="activity.titleColor"
                        :predefine="config.colors"
                      />
                    </el-row>
                    <el-row>
                      <el-slider
                        v-model="activity.titleSize"
                        :min="10"
                        :max="100"
                      />
                    </el-row>
                  </div>
                  <template #reference>
                    <label
                      class="title"
                      id="MainTitle"
                      :style="`color:${activity.titleColor};font-size:${activity.titleSize}px;font-family:ForActivity;`"
                    >
                      {{ activity.title }}
                    </label>
                  </template>
                </el-popover>
              </el-row>
              <el-row v-if="activity.HasSubTitle">
                <el-popover placement="top" :width="200" trigger="contextmenu">
                  <div style="width: 200px">
                    <el-row>
                      <el-color-picker
                        v-model="activity.subTitleColor"
                        :predefine="config.colors"
                      />
                    </el-row>
                    <el-row>
                      <el-slider
                        v-model="activity.subTitleSize"
                        :min="10"
                        :max="100"
                      />
                    </el-row>
                  </div>
                  <template #reference>
                    <label
                      class="title"
                      id="SubTitle"
                      :style="`color:${activity.subTitleColor};font-size:${activity.subTitleSize}px;font-family:ForActivity;`"
                    >
                      {{ activity.subTitle }}
                    </label>
                  </template>
                </el-popover>
              </el-row>
            </el-col>
          </el-row>
        </el-header>
        <el-container style="height: 75%">
          <el-aside style="width: 40%">
            <el-popover placement="top" :width="200" trigger="contextmenu">
              <div>
                <el-radio-group v-model="activity.pictureSpeed">
                  <el-radio
                    v-for="item in config.speeds"
                    :key="item"
                    :label="item"
                  ></el-radio>
                </el-radio-group>
              </div>
              <template #reference>
                <div id="PictureBorder">
                  <Aspratio :ratio="1.2">
                    <div
                      class="leftBorder"
                      :style="`background-image: url(${activity.leftBorder});z-index: 500;`"
                    ></div>
                    <Ascaler :horizontal="90" :vertical="90">
                      <Scroller
                        style="width: 100%; height: 100%"
                        :pictures="activity.pictureUrls"
                        :speed="activity.PictureSpeed"
                        :play="scroll"
                      ></Scroller>
                    </Ascaler>
                  </Aspratio>
                </div>
              </template>
            </el-popover>
          </el-aside>
          <el-main style="width: 60%">
            <el-popover placement="top" :width="200" trigger="contextmenu">
              <div>
                <el-radio-group v-model="activity.signSpeed">
                  <el-radio
                    v-for="item in config.speeds"
                    :key="item"
                    :label="item"
                  ></el-radio>
                </el-radio-group>
              </div>
              <template #reference>
                <div
                  id="MainWindow"
                  style="
                    position: relative;
                    background-color: transparent;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                  "
                >
                  <Container
                    :key="key"
                    v-for="key in Object.keys(locals)"
                    :canvas="locals[key]"
                  >
                  </Container>
                  <Container
                    :key="key"
                    v-for="key in Object.keys(remotes)"
                    :canvas="remotes[key]"
                  >
                  </Container>
                </div>
              </template>
            </el-popover>
          </el-main>
        </el-container>
        <el-footer style="height: 5%; text-align: end">
          <label
            style="
              color: white;
              font-family: 'Helvetica Neue', Helvetica, 'PingFang SC',
                'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
                sans-serif;
            "
          >
            技术支持：南京孜博汇信息科技有限公司
          </label>
        </el-footer>
      </el-container>
    </div>
    <el-image
      id="Background"
      fit="fill"
      style="width: 100%; height: 100%; z-index: 0"
      :src="activity.backgroundUrl"
    >
    </el-image>
  </div>
</template>

<script>
import "animate.css";
import { Activity } from "@/models/Activity";
import { Canvas, Dot, SvgCanvas } from "@/models/Canvas";
import { Stroke, StrokeDivider } from "@/models/Stroke";
import { Animation, EndlessPlayer } from "@/utils/Animation";
import { ComponentKey, Dotpen, IpcMessage, Handlers } from "@/utils/Definition";
import Container from "./Container.vue";
import Scroller from "./Scroller.vue";
import MultipleBorder from "./MultipleBorder.vue";
import Ascaler from "../layout/Ascaler.vue";
import Anoaspratio from "../layout/Anoaspratio.vue";
import Aspratio from "../layout/Aspratio.vue";
export default {
  components: {
    Container,
    Scroller,
    MultipleBorder,
    Anoaspratio,
    Ascaler,
    Aspratio,
  },
  beforeCreate() {
    window.$Dispatcher.invoke(IpcMessage.FullScreen, true);
  },
  async unmounted() {
    this.player.stop();
    clearInterval(this.intervals.queryInterval);
    this.getCanvases().forEach((x) => {
      x.stopUpload();
    });
    if (this.changed) {
      await this.updateInfo();
    }
    window.$Dispatcher.invoke(IpcMessage.FullScreen, false);
  },
  inject: [
    ComponentKey.PlayActicity,
    ComponentKey.Dotpen,
    ComponentKey.Activities,
  ],
  data() {
    return {
      changed: false,
      config: this[ComponentKey.Activities],
      /**
       * @type {Dotpen}
       */
      dotpen: this[ComponentKey.Dotpen],
      /**
       * @type {Activity}
       */
      activity: this[ComponentKey.PlayActicity],
      stylePair: Animation.getOpposite("fade", "Right"),
      intervals: {
        queryInterval: null,
      },
      /**
       * @type {SvgCanvas}
       */
      current: null,
      /**
       * @type {Object<Canvas>}
       */
      locals: {},
      /**
       * @type {Object<Canvas>}
       */
      remotes: {},
      /**
       * @type {Array<StrokeDivider>}
       */
      strokeDividers: {},
      /**
       * @type {EndlessPlayer}
       */
      player: null,
      scroll: true,
    };
  },
  watch: {
    activity: {
      handler(n, o) {
        this.changed = true;
      },
      deep: true,
    },
    ["activity.signSpeed"]: {
      handler(n, o) {
        if (!this.player) return;
        this.player.Between = this.activity.SignSpeed * 1000;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    var vue = this;
    this.loadFont("ForActivity", this.activity.font);
    this.startQuery();
    document.addEventListener("keyup", (e) => {
      if (e.key == "Escape") {
        vue.$emit(Handlers.QuitPlay, null);
      }
    });
    this.dotpen.onDraw(this.callbackHandler());

    let effects = this.activity.rollEffect.split(".");
    this.stylePair = Animation.getOpposite(effects[0], effects[1]);

    this.player = new EndlessPlayer(this.getCanvases)
      .bySeconds(this.activity.SignSpeed)
      .whenElementIn(
        /**
         *
         * @param {SvgCanvas} e
         */
        (e) => {
          e.show();
          e.className = `canvas ${this.stylePair[1]}`;
          e.trigger(null);
        }
      )
      .whenElementOut((e) => {
        e.show();
        e.className = `canvas ${this.stylePair[0]}`;
      })
      .beforeAll(() => {
        this.hideAll();
      })
      .beforeRound(() => {
        this.hideAll();
      })
      .afterAll(() => {
        this.getCanvases().forEach((x) => (x.className = "canvas"));
      });
  },
  mounted() {
    let vue = this;
    setTimeout(() => {
      vue.player.start();
      vue.hideAll();
    }, 3000);
  },
  methods: {
    async query() {
      let pages = await this.activity.queryWrittenPages();
      if (!pages.Success) {
        return;
      }
      this.setPage(pages.data);
    },
    startQuery() {
      if (this.intervals.queryInterval) return;
      this.intervals.queryInterval = setInterval(this.query, 3000);
    },
    setPage(pages) {
      pages.forEach(async (page) => {
        //判断是否已经处理过该页
        if (this.strokeDividers[page]) return;
        let promise = await this.activity.queryStrokes(page);
        if (!promise.Success) return;
        //获取点阵地址
        var addr = this.activity.getPageAddress(page);
        /**
         * @type {Array<Stroke>}
         */
        let strokes = promise.data;
        let divider = new StrokeDivider(
          page,
          addr,
          strokes,
          this.activity,
          this.dotpen.$Name,
          this.locals,
          this.remotes
        );
        divider.accecptStrokes(strokes);
        this.strokeDividers[page] = divider;
      });
    },
    async loadFont(family, url) {
      const font = new FontFace(family, `url(${url})`);
      await font.load();
      document.fonts.add(font);
    },
    showAll() {
      this.getCanvases().forEach((x) => x.show());
    },
    hideAll() {
      this.getCanvases().forEach((x) => x.hide());
    },
    callbackHandler() {
      var vue = this;
      /**
       * @param {Dot} dot
       */
      let createFromLocal = (dot) => {
        /**
         * @type {Canvas}
         */
        let c = vue.locals[dot.address];
        if (!c) {
          if (1) {
            c = vue.locals[dot.address] = new SvgCanvas(
              dot.address,
              vue.dotpen.$Name,
              vue.activity.getPageNum(dot.address)
            );
          } else {
            c = vue.locals[dot.address] = new Canvas(
              null,
              null,
              false,
              dot.address,
              2,
              vue.dotpen.$Name,
              vue.activity.getPageNum(dot.address)
            );
          }
          vue.$nextTick(() => {
            c.uploadInterval(vue.activity.id);
          });
        }
        return c;
      };
      let laterInterval = 0;
      /**
       * @param {Dot} dot
       */
      var del = (dot) => {
        if (!dot.IsMove) {
          if (vue.current) {
            vue.current.draw(dot);
          }
        } else {
          if (!this.activity.isValidDot(dot)) {
            return;
          }
          clearTimeout(laterInterval);
          vue.player.stop();
          if (vue.current == null || vue.current.address != dot.address) {
            vue.current = createFromLocal(dot);
          }
          vue.hideAll();
          vue.current.draw(dot);
          vue.current.show();
          laterInterval = setTimeout(() => {
            vue.showAll();
            vue.player.play();
          }, 5000);
        }
      };
      return del;
    },
    /**
     * @return {Canvas[]}
     */
    getCanvases() {
      var ret = [];
      Object.keys(this.locals).forEach((x) => ret.push(this.locals[x]));
      Object.keys(this.remotes).forEach((x) => ret.push(this.remotes[x]));
      return ret;
    },
    async updateInfo() {
      if (!(await this.activity.changeInfo()).Success) {
        this.$message.error("修改失败");
      }
    },
  },
};
</script>

<style lang="scss">
#MainTitle {
  font-family: "ForActivity";
}

#PlayMain {
  height: 100%;
  width: 100%;
  overflow: hidden;

  #Foreground {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10 !important;
    height: 100%;
    width: 100%;

    .el-row {
      .el-col {
        height: 100%;
      }
    }

    .logo {
      height: 66.6%;
    }

    #Container {
      margin: 25px;
      height: calc(100% - 50px);
      width: calc(100% - 50px);

      .title {
        font-weight: 1000;
        margin: 0 !important;
        height: 100%;
        width: 100%;
        user-select: none;
        letter-spacing: 10px;
        vertical-align: middle;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
        white-space: nowrap;
        line-height: 200%;
      }

      .el-aside {
        overflow: hidden;

        #PictureBorder {
          height: 100%;
          width: 100%;
        }

        .leftBorder {
          position: absolute;
          width: 100%;
          height: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      }

      .canvas {
        left: 0;
        position: absolute;
        z-index: 10 !important;
      }

      label {
        user-select: none;
      }
    }
  }

  #Background {
    position: static;
    left: 0;
    top: 0;
    z-index: 1 !important;
    height: 100%;
    width: 100%;
    background-color: black;
    background-image: url(../../assets/Play/RadiantBackground.jpg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
