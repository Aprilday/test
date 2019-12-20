<template>
    <div class="page-wrap">
        <audio ref="music" crossOrigin="anonymous" type="audio/mpeg">
            <!-- <source > -->
        </audio>
        <div id="audioplayer">
            <button ref="pButton" id="pButton" :class="{play: playStatus === 'pause', pause: playStatus === 'play'}" @click="playAudio"></button>
            <div class="timeline" ref="timeline" @click="skipProgress">
                <div class="progress" ref="progress" style="transform: translateX(-100%);"></div>
                <div @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" class="playhead" ref="playhead" style="transform: translateX(0);"></div>
            </div>
        </div>
        <div class="pn-wrap">
            <div>{{currentTime | timeFormat}}</div>
            <div class="prev" @click="skip('pre')"></div>
            <div class="next" @click="skip('next')"></div>
            <div>{{duration | timeFormat}}</div>
        </div>
        <!-- <div>{{currentTime | timeFormat}}</div>
        <div>{{duration | timeFormat}}</div> -->
        <ul class="play-list">
            <li :class="{cur: index === curAudioIndex}" v-for="(item, index) in list" :key="index" @click="playThisAudio(index)">{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            playStatus: 'pause',
            curIndex: 0, // 当前播放音频的索引
            currentTime: 0, // 当前播放时间
            duration: 0, // 音频时长
            curAudioIndex: 0,
            list: [
                {
                    audioContent: 'http://127.0.0.1:9000/music1.mp3',
                    name: '第一首歌'
                },
                {
                    audioContent: 'http://127.0.0.1:9000/music2.mp3',
                    name: '我是谁'
                },
                {
                    audioContent: 'http://127.0.0.1:9000/music3.mp3',
                    name: '你瞅啥'
                },
                {
                    audioContent: 'http://127.0.0.1:9000/music4.mp3',
                    name: '明天会更好吗'
                },
                {
                    audioContent: 'http://127.0.0.1:9000/music5.mp3',
                    name: '你走吧'
                },
            ]
        }
    },
    computed: {
        
    },
    filters: {
        timeFormat(val) {
            let min = Math.floor(val / 60);
            let sec = val % 60;
            if (min < 10) {
                min = `0${min}`
            }
            if (sec < 10) {
                sec = `0${sec}`
            }
            return `${min}:${sec}`;
        }
    },
    created() {
        
    },
    mounted() {
        // 当前audio标签
        this.audio = this.$refs.music;
        setTimeout(() => {
            this.audio.src = this.list[0].audioContent;
        }, 800)
        // 移动播放指针
        this.playhead = this.$refs.playhead;
        // 进度条
        this.timeline = this.$refs.timeline;
        // 已播放进度条
        this.progress = this.$refs.progress;
        // 进度条长度，要减去播放指针的长度
        this.progressWidth = this.timeline.offsetWidth - this.$refs.playhead.offsetWidth;

        // 初始化音频事件
        this.$nextTick(() => {
            this.initEvent();
        })
        
    },
    methods: {
        playAudio() {
            const pButton = this.$refs['pButton'];
            if (this.audio.paused) {
                this.audio.play();
                // pButton.className = "";
                // pButton.className = "pause";
            } else {
                this.audio.pause();
                // pButton.className = "";
                // pButton.className = "play";
            }
        },
        playThisAudio(index) {
            this.audio.src = this.list[index].audioContent;
            this.curAudioIndex = index;
        },
        // 上一首/下一首
        skip(type) {
            if (type === 'pre') {
                if (this.curAudioIndex > 1) {
                    this.curAudioIndex -= 1
                }
            } else {
                if (this.curAudioIndex < this.list.length - 1) {
                    this.curAudioIndex += 1
                }
            }
            this.audio.src = this.list[this.curAudioIndex].audioContent;
            this.audio.play();
            this.restartStatus()
        },
        initEvent() {
            this.audio.addEventListener("timeupdate", () => {
                const playPercent = this.audio.currentTime / this.duration;
                if (playPercent < 1) {
                    // 设置进度条和指针的位置
                    this.playhead.style.transform = `translateX(${playPercent * this.progressWidth}px)`
                    this.progress.style.transform = `translateX(${-this.progressWidth + (playPercent * this.progressWidth)}px)`
                    // 设置当前播放时间
                    this.currentTime = Math.floor(this.audio.currentTime);
                }
            });

            this.audio.addEventListener("loadstart", function() {
                console.log('start loading')
            });

            // 获取音频总时长
            this.audio.addEventListener("durationchange", () => {
                if (this.audio.duration) {
                    this.duration = Math.floor(this.audio.duration);
                }
            });
            // 音频播放结束事件
            this.audio.addEventListener("ended", () => {
                console.log('结束了')
                // 短暂同步一下最后一秒时间，因为计算时间会少一秒
                this.currentTime = Math.floor(this.audio.duration);

                this.skip('next');
            });
            this.audio.addEventListener("play", () => {
                this.playStatus = 'play';
            });
            this.audio.addEventListener("pause", () => {
                this.playStatus = 'pause';
            });
            // 音频加载
            // this.audio.addEventListener("progress", function() {
                
            // });


            this.audio.addEventListener("canplay", () => {
                console.log('canplay')
            });

            this.audio.addEventListener("canplaythrough", () => {
                console.log('canplaythrough')
            });
        },
        // 重置播放器状态
        restartStatus() {
            // this.playhead.style.transform = 'translateX(0)';
            // this.progress.style.transform = `translateX(-100%)`;
            this.syncStatus(0);
        },
        // 进度条拖动或点击进度条同步
        syncStatus(skipTo) {
            if (skipTo >= this.progressWidth) {
                skipTo = this.progressWidth;
            }
            if (skipTo <= 0) {
                skipTo = 0;
            }
            // 当前播放时间设置
            this.audio.currentTime = Math.floor((skipTo / this.progressWidth) * this.duration)
            // console.log((skipTo / this.progressWidth) * this.duration)
            // 进度条设置
            this.playhead.style.transform = `translateX(${skipTo}px)`;
            this.progress.style.transform = `translateX(${skipTo - this.progressWidth}px)`;
        },
        // 点击进度条跳到相应播放进度
        skipProgress(e) {
            e.preventDefault();
            let skipTo = e.pageX - this.timeline.offsetLeft;
            // console.log(skipTo)
            this.syncStatus(skipTo)
        },
        touchStart(e) {
            e.preventDefault();
            // console.log(e.targetTouches[0].pageX, 'start');
        },
        touchMove(e) {
            this.syncStatus(e.targetTouches[0].pageX - this.timeline.offsetLeft);
            if (!this.audio.paused) {
                this.audio.pause()
            }
            // console.log(e.targetTouches[0].pageX, 'moving');
        },
        touchEnd(e) {
            this.audio.play();
            // console.log(e.targetTouches[0].pageX, 'end');
        }
    }
        
}
</script>
<style lang="stylus" scoped>
    #audioplayer {
        display flex
    }
    #pButton{
        float: left;
        height:60px;
        width: 60px;
        border: none;
        background-size: 50% 50%;
        background-position: center;
    }
    .pn-wrap {
        display flex
        justify-content space-around
        margin: 20px auto;
    }
    .prev, .next {
        width 30px
        height 30px
        background-image url(../assets/prev.png)
        background-repeat no-repeat
        background-size 100%
    }
    .next {
        transform rotate(-180deg)
    }
    .play, .pause {
        margin-right 50px
    }
    .play{
        background: url('../assets/play.png') no-repeat;
    }
    .pause{
        background: url('../assets/pause.png') no-repeat;
    }
    .timeline{
        flex: 1;
        position relative
        // width 400px
        height 20px
        background #ddd
        margin-top 20px
        float left
        border-radius 15px
        overflow hidden
    }

    .playhead{
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-top: 1px;
        background: #000;
    }
    .progress {
        position absolute
        left 0
        width 100%
        height 20px
        background-color #666
        border-radius 10px
    }
    .play-list {
        li {
            cursor pointer
            color #333
            margin-bottom 30px
            &.cur {
                color: #1296db
            }
        }
    }
</style>