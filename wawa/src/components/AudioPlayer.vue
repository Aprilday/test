<template>
    <div class="page-wrap">
        <audio ref="music" crossOrigin="anonymous" type="audio/mpeg">
            <!-- <source > -->
        </audio>
        <div id="audioplayer">
            <button ref="pButton" id="pButton" class="play" @click="playAudio"></button>
            <div class="timeline" ref="timeline" @click="skip">
                <div class="progress" ref="progress" style="transform: translateX(-100%);"></div>
                <div @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" class="playhead" ref="playhead" style="transform: translateX(0);"></div>
            </div>
        </div>
        <div>{{currentTime | timeFormat}}</div>
        <div>{{duration | timeFormat}}</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            curIndex: 0, // 当前播放音频的索引
            currentTime: 0, // 当前播放时间
            duration: 0, // 音频时长
            curAudio: '',
            list: ['../assets/music1.mp3', '../assets/music2.mp3']
        }
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
        // this.music = new Audio();
        // this.music.crossOrigin = "anonymous"
        // this.music.type = "audio/mpeg"
        // console.log(this.music)
        // this.music = this.$refs.music;
        // this.music.src = this.list[0];
        // document.body.appendChild(this.music)
    },
    mounted() {
        // 当前audio标签
        this.music = this.$refs.music;
        this.music.src = this.list[0];
        // 移动播放指针
        this.playhead = this.$refs.playhead;
        // 进度条
        this.timeline = this.$refs.timeline;
        // 已播放进度条
        this.progress = this.$refs.progress;
        // 进度条长度，要减去播放指针的长度
        this.progressWidth = this.timeline.offsetWidth - this.$refs.playhead.offsetWidth;

        // 初始化音频事件
        this.initEvent();
    },
    methods: {
        playAudio() {
            console.log(this.music.paused)
            const pButton = this.$refs['pButton'];
            if (this.music.paused) {
                this.music.play();
                pButton.className = "";
                pButton.className = "pause";
            } else {
                this.music.pause();
                pButton.className = "";
                pButton.className = "play";
            }
        },
        initEvent() {
            this.music.addEventListener("timeupdate", () => {
                const playPercent = this.music.currentTime / this.duration;
                if (playPercent < 1) {
                    // 设置进度条和指针的位置
                    this.playhead.style.transform = `translateX(${playPercent * this.progressWidth}px)`
                    this.progress.style.transform = `translateX(${-this.progressWidth + (playPercent * this.progressWidth)}px)`
                    // 设置当前播放时间
                    this.currentTime = Math.floor(this.music.currentTime);
                }
                // console.log(this.music.currentTime);
                // console.log(this.music.buffered);
            });

            // 获取音频总时长
            this.music.addEventListener("durationchange", () => {
                if (this.music.duration) {
                    this.duration = Math.floor(this.music.duration);
                }
            });
            // 音频播放结束事件
            this.music.addEventListener("ended", () => {
                this.currentTime = Math.floor(this.music.duration);
            })
            // 音频加载
            this.music.addEventListener("progress", function() {
                // console.log(123);
            });


            this.music.addEventListener("canplay", () => {
                console.log('canplay')
            });

            // playhead.addEventListener("canplaythrough", () => {

            // }, false);
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
            this.music.currentTime = Math.floor((skipTo / this.progressWidth) * this.duration)
            // console.log((skipTo / this.progressWidth) * this.duration)
            // 进度条设置
            this.playhead.style.transform = `translateX(${skipTo}px)`;
            this.progress.style.transform = `translateX(${skipTo - this.progressWidth}px)`;
        },
        // 点击进度条跳到相应播放进度
        skip(e) {
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
            if (!this.music.paused) {
                this.music.pause()
            }
            // console.log(e.targetTouches[0].pageX, 'moving');
        },
        touchEnd(e) {
            this.music.play();
            this.curAudio = this.list[1];
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
</style>