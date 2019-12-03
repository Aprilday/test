<template>
    <div class="page-wrap">
        <header class="page-header">
            <h1>小零钱，大惊喜</h1>
            <p>2元零钱即可抓一次，有机会获得688元黄金手串</p>
            <span class="act-rule" @click="rules">活动规则 > </span>
        </header>
        <section class="page-content">
            <div class="content-prize" id="hook-wrap">
                <div class="prize-hook" id="hook" style="left: 0;">-></div>
                <ul class="prize-list">
                    <li v-for="(item, index) in prizes" :key="index" :style="{width: item.diameter + 'px', height: item.diameter + 'px', left: item.left + 'px', top: item.top + 'px'}">
                        {{item.name}}
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>
<script>
export default {
    data() {
        return {
            prizes: [
                {
                    name: '黄金手串',
                    diameter: '',
                    left: 0,
                    top: ''
                },
                {
                    name: '盲盒',
                    diameter: '',
                    left: 27,
                    top: ''
                },
                {
                    name: '黄金手串',
                    diameter: '',
                    left: 60,
                    top: ''
                },
                {
                    name: '黄金手串',
                    diameter: '',
                    left: 99,
                    top: ''
                },
                {
                    name: '盲盒',
                    diameter: '',
                    left: 113,
                    top: ''
                },
                {
                    name: '黄金手串',
                    diameter: '',
                    left: 150,
                    top: ''
                },
                {
                    name: '黄金手串',
                    diameter: '',
                    left: 199,
                    top: ''
                },

            ]
        }
    },
    created() {
        this.prizes.forEach(element => {
            let diameter = Math.random() * 30 + 30;
            let left = element.left + Math.random() * 60;
            let top = Math.random() * 40
            element.diameter = diameter;
            element.left = left;
            element.top = top;
        });
    },
    mounted() {
        this.hook = document.getElementById('hook');
        this.hookWrap = document.getElementById('hook-wrap');
        const self = this;
        this.timer = requestAnimationFrame(function cb() {
            // let direction = ''
            // if (this.hook.style.left >= document.body.clientWidth) {
            //     direction = 'left'
            // } else if (this.hook.style.left <= 0) {
            //     direction = 'right'
            // }
            // console.log(this.hook.style.left);
            let left = parseInt(self.hook.style.left);
            self.hook.style.left = left + 1 + 'px';
            self.timer = requestAnimationFrame(cb);
            
            if (left >= self.hookWrap.clientWidth - 70) {
                cancelAnimationFrame(self.timer);
            }
        })
    },
    methods: {
        rules() {
            console.log('活动规则')
        }
    }
}
</script>
<style lang="stylus" scoped>
    .page-wrap
        height 100%
        background #333
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
        background #fff
        .content-prize
            position relative
            padding-top 270px
            .prize-hook
                position absolute
                top 0
                font-size 60px
                color #000
                line-height 1
                transform rotate(90deg)
            .prize-list
                list-style-type none
                position relative
                height 100px
                overflow hidden
                font-size 12px
                li 
                    position absolute
                    border-radius 50%
                    top 0
                    background #fa0

</style>