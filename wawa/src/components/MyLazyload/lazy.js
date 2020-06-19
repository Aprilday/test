// 空白图
const DEFAULT_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
function throttle (action, delay) {
    let timeout = null
    let lastRun = 0
    return function () {
      if (timeout) {
        return
      }
      let elapsed = Date.now() - lastRun
      let context = this
      let args = arguments
      let runCallback = function () {
        lastRun = Date.now()
        timeout = false
        action.apply(context, args)
      }
      if (elapsed >= delay) {
        runCallback()
      } else {
        timeout = setTimeout(runCallback, delay)
      }
    }
}
class ImageCache {
    constructor ({ max }) {
      this.options = {
        max: max || 100
      }
      this._caches = []
    }
  
    has (key) {
      return this._caches.indexOf(key) > -1
    }
  
    add (key) {
      if (this.has(key)) return
      this._caches.push(key)
      if (this._caches.length > this.options.max) {
        this.free()
      }
    }
  
    free () {
      this._caches.shift()
    }
}
///*
class ReactiveListener {
    constructor ({ el, src, error, loading, options, elRenderer, imageCache }) {
        this.el = el
        this.src = src
        this.error = error
        this.loading = loading

        this.naturalHeight = 0
        this.naturalWidth = 0

        this.options = options

        this.rect = null
        this.elRenderer = elRenderer
        this._imageCache = imageCache
        this.initState()
        this.render('loading')
    }
    initState() {
        if ('dataset' in this.el) {
            this.el.dataset.src = this.src
        } else {
            this.el.setAttribute('data-src', this.src)
        }
    
        this.state = {
            loading: false,
            error: false,
            loaded: false,
            rendered: false
        }
    }

    render(state) {
        this.elRenderer(this, state)
    }

    getRect () {
        this.rect = this.el.getBoundingClientRect()
    }
    
    heckInView () {
        this.getRect()
        return (this.rect.top < window.innerHeight * this.options.preLoad && this.rect.bottom > this.options.preLoadTop) &&
                (this.rect.left < window.innerWidth * this.options.preLoad && this.rect.right > 0)
      }
}
//*/
export default function (Vue) {
    return class Lazy {
        constructor({ preLoad, loading = DEFAULT_URL, error = DEFAULT_URL, throttleWait = 200, }) {
            this.ListenerQueue = [];
            this.options = {
                preLoad: preLoad,
                loading: loading,
                error: error,
                throttleWait: throttleWait
            }
            this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)
            this._imageCache = new ImageCache({ max: 200 })
            window.addEventListener('scroll', this.lazyLoadHandler, false);
        }
    
        _lazyLoadHandler() {
            console.log('lazylaod handler')
        }
        _elRenderer() {
            console.log('render')
        }
        add (el, binding) {
            let src = binding.value || binding.value.src;
            let loading = binding.value.loading || this.loading;
            let error = binding.value.error || this.error;

            // console.log(el, binding);
            Vue.nextTick(() => {
              const newListener = new ReactiveListener({
                el,
                loading,
                error,
                src,
                elRenderer: this._elRenderer.bind(this),
                options: this.options,
                imageCache: this._imageCache
              })

              this.ListenerQueue.push(newListener)
    
            //   this.lazyLoadHandler()
            //   Vue.nextTick(() => this.lazyLoadHandler())
            })
        }
    }
}