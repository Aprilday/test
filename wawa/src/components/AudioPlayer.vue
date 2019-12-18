<template>
    <div class="page-wrap">
        <audio ref="music" crossOrigin="anonymous" >
            <source src="../assets/music1.mp3">
        </audio>
        <div id="audioplayer">
            <button ref="pButton" id="pButton" class="play" @click="playAudio"></button>
            <div id="timeline" ref="timeline">
                <div id="playhead" ref="playhead"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
    created() {
        
    },
    mounted() {
        this.music = this.$refs.music;
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
            // var duration;
            // const playhead = document.getElementById('playhead');
            
            this.music.addEventListener("timeupdate", () => {
                var playPercent = 100 * (this.music.currentTime / this.duration);
                console.log(playPercent);
                // playhead.style.marginLeft = playPercent + "%";
            });

            this.music.addEventListener("canplay", () => {
                this.duration = this.music.duration;
            });



            // Gets audio file duration
            // playhead.addEventListener("canplaythrough", () => {
            //     duration = this.music.duration;
            // }, false);
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
    #timeline{
        width: 400px;
        height: 20px;
        background: #ccc;
        margin-top: 20px;
        float: left;
        border-radius: 15px;
    }

    #playhead{
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-top: 1px;
        background: #000;
    }
</style>