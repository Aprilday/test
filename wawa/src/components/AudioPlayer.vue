<template>
    <div class="page-wrap">
        <audio ref="music" crossOrigin="anonymous" >
            <source src="../assets/music1.mp3">
        </audio>
        <div id="audioplayer">
            <button ref="pButton" id="pButton" class="play" @click="playAudio"></button>
            <div class="timeline" ref="timeline">
                <div class="progress" ref="progress" style="transform: translateX(-100%);"></div>
                <div class="playhead" ref="playhead" style="transform: translateX(0);"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            curIndex: 0, // 当前播放音频的索引
        }
    },
    created() {
        
    },
    mounted() {
        // 当前audio标签
        this.music = this.$refs.music;
        // 移动播放指针
        this.playhead = this.$refs.playhead;
        // 已播放进度条
        this.progress = this.$refs.progress;
        // 进度条长度，要减去播放指针的长度
        this.progressWidth = this.$refs.timeline.clientWidth - this.$refs.playhead.clientWidth;
        // 初始化音频事件
        this.initEvent();
    },
    methods: {
        playAudio() {
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
                var playPercent = this.music.currentTime / this.duration;
                if (playPercent < 1) {
                    this.playhead.style.transform = `translateX(${playPercent * this.progressWidth}px)`
                    this.progress.style.transform = `translateX(${-this.progressWidth + (playPercent * this.progressWidth)}px)`
                    
                }
            });

            this.music.addEventListener("canplay", () => {
                this.duration = this.music.duration;
            });



            // Gets audio file duration
            // playhead.addEventListener("canplaythrough", () => {
            //     duration = this.music.duration;
            // }, false);
        },
        // 重置播放器状态
        restartStatus() {
            this.playhead.style.transform = 'translateX(0)';
            this.progress.style.transform = `translateX(-100%)`;
        },
        movePosition() {
            //Makes timeline clickable
            const timeline = this.$refs.timeline;
            timeline.addEventListener("click", function (event) {
                moveplayhead(event);
                music.currentTime = duration * clickPercent(event);
            }, false);

            // returns click as decimal (.77) of the total timelineWidth
            function clickPercent(event) {
                return (event.clientX - getPosition(timeline)) / timelineWidth;
            }

            function moveplayhead(event) {
                var newMargLeft = event.clientX - getPosition(timeline);

                // if (newMargLeft = 0 amp;amp; newMargLeft = timelineWidth) {
                //     playhead.style.marginLeft = newMargLeft + "px";
                // }
                // if (newMargLeft  0) {
                //     playhead.style.marginLeft = "0px";
                // }
                // if (newMargLeft  timelineWidth) {
                //     playhead.style.marginLeft = timelineWidth + "px";
                // }
            }

            // getPosition
            // Returns elements left position relative to top-left of viewport
            function getPosition(el) {
                return el.getBoundingClientRect().left;
            }
        }
    }
        
}
</script>
<style lang="stylus" scoped>
    #pButton{
        float: left;
        height:60px;
        width: 60px;
        border: none;
        background-size: 50% 50%;
        background-position: center;
    }
    .play{background: url('../assets/play.png') no-repeat;}
    .pause{background: url('../assets/pause.png') no-repeat;}
    .timeline{
        position relative
        width 400px
        height 20px
        background #ccc
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