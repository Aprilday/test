<template>
    <div class="page-wrap">
        <header class="page-header">
            <h1>小零钱，大惊喜</h1>
            <p>2元零钱即可抓一次，有机会获得688元黄金手串</p>
            <span class="act-rule" @click="rules">活动规则 > </span>
        </header>
        <section class="page-content">
            <div class="content-prize" ref="hook-wrap">
                <div class="prize-hook" ref="hook" style="left: 0;top: 0;">={{catching ? '&lt;' : '&gt;'}}<div class="prize" :style="{display: catching ? 'block' : 'none'}"></div></div>
                <ul class="prize-list">
                    <li v-for="(item, index) in prizes" :key="index" :style="{width: item.diameter + 'px', height: item.diameter + 'px', left: item.left + 'px', top: item.top + 'px'}">
                        {{item.name}}
                    </li>
                </ul>
            </div>
        </section>
        <div class="btn-wrap">
            <button @click="start" v-if="status === 0">2元抓手串</button>
            <button @click="stop" v-else :disabled="status === 1">停（{{countdown}}S）</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            prizes: [],
            status: 0, // 0 可抓取 -1 不可抓取
            countdown: 10,
            catching: false // 是否开始向下移动并抓取
        }
    },
    created() {
        this.prizeGen();
    },
    mounted() {
        this.hook = this.$refs['hook'];
        this.hookWrap = this.$refs['hook-wrap'];
    },
    methods: {
        prizeGen() {
            this.prizes = [];
            let tempPrize = [];
            const clientWidth = document.body.clientWidth;
            let PrizeCount = 20; // 下面显示的奖品数量

            for(let i = 0; i < PrizeCount; i++) {
                let curLeft = Math.random() * clientWidth;
                let curTop = Math.random() * 60;
                let diameter = Math.random() * 30 + 30;
                let curName = Math.random() > 0.7 ? '黄金手串' : '盲盒'

                tempPrize.push({
                    name: curName,
                    diameter: diameter,
                    left: curLeft,
                    top: curTop
                })
            }

            this.prizes = tempPrize;
        },
        rules() {
            console.log('活动规则')
        },
        start() {
            this.status = -1;
            this.catching = false;
            this.moveHorizontal();
            this.startCountdown();
        },
        stop() {
            this.clearTimers();
        },
        // 清除所有定时器
        clearTimers() {
            this.status = 1;
            clearInterval(this.countdownTimer);
            cancelAnimationFrame(this.hookTimer);
            this.moveVertical();
        },
        resetData() {
            this.hook.style.top = 0;
            this.countdown = 10;
            this.status = 0;
        },
        // 按钮倒计时
        startCountdown() {
            let countdown = 10;
            this.countdownTimer = setInterval(() => {
                if (countdown === 1) {
                    this.clearTimers();
                }
                countdown -= 1;
                this.countdown = countdown; 
            }, 1000)
        },
        moveHorizontal() {
            const self = this;
            const width = self.hookWrap.clientWidth;
            let speed = 1;
            this.hookTimer = requestAnimationFrame(function cb() {
                let left = parseInt(self.hook.style.left);
                self.hook.style.left = left + speed + 'px';
                
                if (left >= width - 60) {
                    cancelAnimationFrame(self.hookTimer);
                    speed = -1;
                } else if (left <= 20) {
                    cancelAnimationFrame(self.hookTimer);
                    speed = 1;
                }
                self.hookTimer = requestAnimationFrame(cb);
                
            })
        },
        moveVertical() {
            const self = this;
            const height = this.hookWrap.clientHeight - 100 - 60;
            let speed = 1;
            this.catchTimer = requestAnimationFrame(function cb() {
                let top = parseInt(self.hook.style.top);
                self.hook.style.top = top + speed + 'px';
                self.catchTimer = requestAnimationFrame(cb);
                
                if (top >= height) {
                    cancelAnimationFrame(self.catchTimer);
                    speed = -1;
                    self.catching = true;
                    self.catchTimer = requestAnimationFrame(cb);
                }
                if (top < 0) {
                    cancelAnimationFrame(self.catchTimer);
                    // 一轮完整流程结束
                    self.resetData();
                }
            })
        },
    }
}
</script>
<style lang="stylus" scoped>
    .page-wrap
        height 100%
        background #333
        // box-sizing border-box
        padding 0 30px 30px
    .page-header
        color #fff
        h1
            font-weight normal
        p
            font-size 12px
        .act-rule
            position absolute
            top 10px
            right 0
            font-size 12px
            background blue
    .page-content
        margin: 30px 0
        background #fff
        .content-prize
            position relative
            padding-top 270px
            overflow hidden
            .prize-hook
                position absolute
                font-size 60px
                letter-spacing -10px
                color #000
                line-height 1
                transform rotate(90deg)
                &:before
                    content ''
                    position absolute
                    top 50%
                    left -295px
                    width 300px
                    height 2px
                    background #000
                .prize
                    position absolute
                    bottom 50%
                    margin-bottom -30px
                    left 65px
                    background red
                    width 60px
                    height 60px
                    border-radius 50%

            .prize-list
                list-style-type none
                position relative
                height 100px
                overflow hidden
                font-size 12px
                white-space nowrap
                line-height 30px
                li 
                    position absolute
                    border-radius 50%
                    top 0
                    background #fa0
    .btn-wrap
        button
            background #eee
</style>