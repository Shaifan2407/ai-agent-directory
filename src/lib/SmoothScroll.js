export class SmoothScroll {
    constructor(options) {
      this.target = options.target
      this.scrollEase = options.scrollEase || 0.1
      this.maxOffset = options.maxOffset || 500
      this.currentY = 0
      this.targetY = 0
      this.scrolling = false
      this.rafId = null
  
      this.init()
    }
  
    init() {
      window.addEventListener("scroll", this.onScroll.bind(this))
      this.animate()
    }
  
    onScroll() {
      this.targetY = window.pageYOffset
      if (!this.scrolling) {
        this.scrolling = true
        this.rafId = requestAnimationFrame(this.animate.bind(this))
      }
    }
  
    animate() {
      const diff = this.targetY - this.currentY
      const delta = Math.abs(diff) < 0.1 ? 0 : diff * this.scrollEase
  
      if (delta) {
        this.currentY += delta
        this.scrolling = true
  
        const elements = this.target.querySelectorAll("[data-depth]")
        elements.forEach((el) => {
          const depth = Number.parseFloat(el.getAttribute("data-depth"))
          const movement = (depth / 10) * this.maxOffset
          const y = (this.currentY / (document.documentElement.scrollHeight - window.innerHeight)) * movement
          el.style.transform = `translateY(${y}px)`
        })
  
        this.target.style.transform = `translateY(${-this.currentY}px)`
        this.rafId = requestAnimationFrame(this.animate.bind(this))
      } else {
        this.scrolling = false
      }
    }
  
    destroy() {
      window.removeEventListener("scroll", this.onScroll.bind(this))
      if (this.rafId) {
        cancelAnimationFrame(this.rafId)
      }
      this.target.style.transform = ""
      const elements = this.target.querySelectorAll("[data-depth]")
      elements.forEach((el) => {
        el.style.transform = ""
      })
    }
  }
  
  