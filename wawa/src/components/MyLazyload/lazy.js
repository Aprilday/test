// 空白图
const DEFAULT_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const PlaceHolderImg = require('./loading.png');
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
function remove (arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) return arr.splice(index, 1)
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
const loadImageAsync = (item, resolve, reject) => {
  let image = new Image()
  if (!item || !item.src) {
    const err = new Error('image src is required')
    return reject(err)
  }

  image.src = item.src
  if (item.cors) {
    image.crossOrigin = item.cors
  }

  image.onload = function () {
    resolve({
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
      src: image.src
    })
  }

  image.onerror = function (e) {
    reject(e)
  }
}
class ReactiveListener {
    constructor ({ el, src, error, loading, options, elRenderer, imageCache, loadDirectly, errorCb, successCb }) {
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

        this.errorCb = errorCb
        this.successCb = successCb

        this.loadDirectly = loadDirectly

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
    
    checkInView () {
        this.getRect()
        return (this.rect.top < window.innerHeight * this.options.preLoad) &&
                (this.rect.left < window.innerWidth * this.options.preLoad && this.rect.right > 0)
    }

    renderLoading (cb) {
      this.state.loading = true
      loadImageAsync({
        src: this.loading,
        cors: this.cors
      }, () => {
        this.render('loading')
        this.state.loading = false
        cb()
      }, () => {
        // handler `loading image` load failed
        console.log('loading error')
        cb()
        this.state.loading = false
      })
    }

    load () {
      // console.log(this.state)
      if (this.state.rendered && this.state.loaded) return
      if (this._imageCache.has(this.src)) {
        this.state.loaded = true
        this.render('loaded')
        this.state.rendered = true
        return
      }
  
      this.renderLoading(() => {
        loadImageAsync({
          src: this.src,
          cors: this.cors
        }, data => {
          this.naturalHeight = data.naturalHeight
          this.naturalWidth = data.naturalWidth
          this.state.loaded = true
          this.state.error = false
          this.render('loaded')
          this.state.rendered = true
          this._imageCache.add(this.src)
        }, err => {
          // console.log('image error')
          console.error(err)
          this.state.error = true
          this.state.loaded = false
          this.render('error')
        })
      })
    }
}
function noop() {}
export default function (Vue) {
    return class Lazy {
        constructor({ preLoad, loading = PlaceHolderImg, error = PlaceHolderImg, throttleWait = 200}) {
            this.ListenerQueue = [];
            this.options = {
                preLoad: preLoad,
                loading: loading,
                error: error,
                throttleWait: throttleWait
            }
            // console.log(loading)
            this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)
            this._imageCache = new ImageCache({ max: 200 })
            window.addEventListener('scroll', this.lazyLoadHandler, false);
        }
    
        _lazyLoadHandler() {
          const freeList = []
          this.ListenerQueue.forEach((listener) => {
            if (!listener.el || !listener.el.parentNode) {
              freeList.push(listener)
            }
            const catIn = listener.checkInView()
            console.warn(catIn)
            if (!catIn) return
            listener.load()
          })
          freeList.forEach(item => {
            remove(this.ListenerQueue, item)
            item.$destroy()
          })
        }
        _elRenderer(listener, state) {
          if (!listener.el) return
          const { el } = listener
          let src
          switch (state) {
            case 'loading':
              src = DEFAULT_URL
              if (!listener.loadDirectly) {
                el.style.backgroundImage = `url(${listener.loading})`
                el.style.backgroundColor = '#f0f0f0'
                el.style.backgroundSize = '100px'
                el.style.backgroundRepeat = 'no-repeat'
                el.style.backgroundPosition = '50%'
              }
              break
            case 'error':
              src = DEFAULT_URL
              el.style.backgroundImage = `url(${listener.error})`
              el.style.backgroundColor = '#f0f0f0'
              el.style.backgroundSize = '100px'
              el.style.backgroundRepeat = 'no-repeat'
              el.style.backgroundPosition = '50%'
              listener.errorCb()
              listener.errorCb = noop
              break
            default:
              src = listener.src
              el.style.backgroundColor = 'transparent'
              el.style.backgroundImage = 'none'
              listener.successCb();
              listener.successCb = noop
              break
          }
          el.setAttribute('src', src)
        }
        add (el, binding) {
            let src = typeof binding.value === 'string' ? binding.value : binding.value.src;
            let loading = binding.value.loading || this.options.loading;
            let error = binding.value.error || this.options.error;
            // 直接加载图片，绕过懒加载
            if (binding.value.unUseLazy) {
              el.src = src
              return
            }
            // 图片加载失败回调
            let errorCb = binding.value.errorCb ? binding.value.errorCb : noop; 
            // 图片记载成功回调
            let successCb = binding.value.successCb ? binding.value.successCb : noop;
            
            Vue.nextTick(() => {
              const newListener = new ReactiveListener({
                el,
                loading,
                error,
                src,
                loadDirectly: binding.value.loadDirectly,
                elRenderer: this._elRenderer.bind(this),
                options: this.options,
                imageCache: this._imageCache,
                errorCb: errorCb.bind(this, binding.value.param),
                successCb: successCb.bind(this, binding.value.param)
              })

              this.ListenerQueue.push(newListener)
    
              this.lazyLoadHandler()
              Vue.nextTick(() => this.lazyLoadHandler())
            })
        }
    }
}