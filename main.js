class Gallery {
    constructor(container, {size, url, looping}){
        this.container = container
        this.url = 'https://cors-anywhere.herokuapp.com/' + url
        this.looping = looping
        this.startX = null
        this.imageIndex = 0
        this.size = size

        this.imageWrap = document.createElement('div')
        this.imageWrap.className = "images"
        this.container.appendChild(this.imageWrap)
        this.container.style.overflow = 'hidden'
        this.container.style.position = 'relative'
        this.container.style.setProperty('user.select', 'none')
        this.container.style.setProperty('width', this.size)

        this.pagination = document.createElement('div')
        this.pagination.className = "pagination"
        container.appendChild(this.pagination)

        this.dots = container.getElementsByClassName('dot')

        this.container.addEventListener('touchmove', e => {e.preventDefault()}, false)
        this.container.addEventListener('mousedown', e => this.startDrag(e), false)
        this.container.addEventListener('touchstart', e => this.startDrag(e), false)

        window.addEventListener('mouseup', e => this.endDrag(e), false)
        window.addEventListener('touchend', e => this.endDrag(e), false)
        this.load()
    }
    load(){
        let self = this
        var http = new XMLHttpRequest()
        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200)
                self.fetchImages(JSON.parse(http.response)) 
        }
        http.open('GET', './data', true)
        http.send()
    }
    fetchImages(imgs){
        this.urls = imgs.map(img => img.url)

        let firstImage = document.createElement('img')
        firstImage.src = this.urls[0]
        this.imageWrap.appendChild(firstImage)
        this.currentImage = firstImage
    
        for(var i = 0; i < imgs.length; i++){
            let newSpan = document.createElement('span')
            newSpan.innerText = '●'
            newSpan.className = i === 0 ? 'dot active' : 'dot'
            this.pagination.appendChild(newSpan)
        }
    }
    startDrag(e){
        this.startX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    }
    endDrag(e){
        let clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
        if(this.startX !== null){
            let dx = clientX - this.startX
            if (dx < -40)
                this.nextItem()
            else if (dx > 40)
                this.previousItem()
            this.startX = null
        }
    }
    setActiveImg(num){
        this.dots[this.imageIndex].className = "dot"
        if (num < 0)
            this.imageIndex = this.urls.length - 1
        else if (num >= this.urls.length)
            this.imageIndex = 0
        else
            this.imageIndex = num
        this.dots[this.imageIndex].className = "dot active"
    }
    nextItem(){
        if (this.looping || this.imageIndex < this.urls.length - 1){
            this.setActiveImg(this.imageIndex + 1)
            this.transitionImage(this.urls[this.imageIndex], -1)
        }
        else
            console.log('out of bound!')
    }
    previousItem(){
        if (this.looping || this.imageIndex > 0){
            this.setActiveImg(this.imageIndex - 1)
            this.transitionImage(this.urls[this.imageIndex], 1)
        }
        else
            console.log('out of bound!')
    }
    goToItem(num){
        if (num >= 0 && num < this.urls.length){
            let direction = num > this.imageIndex ? -1 : 1
            this.setActiveImg(num)
            this.transitionImage(this.urls[this.imageIndex], direction)
        }
        else
            console.log('out of bound!')
    }
    transitionImage(url, direction){
        let newImage = document.createElement('img')
        newImage.src = url
        newImage.style.position = 'absolute'
        newImage.style.left = '0'
        newImage.style.transform = direction === 1 ? 'translateX(-100%)' : 'translateX(100%)'
        this.imageWrap.appendChild(newImage)

        this.currentImage.style.transform = direction === 1 ? 'translateX(100%) scale(0.7)' : 'translateX(-100%) scale(0.7)'

        setTimeout(() => {
            newImage.style.transform = 'translateX(0)'

            setTimeout(() => {
                this.currentImage.remove()
                newImage.style.position = 'initial'
                newImage.style.left = null
                newImage.style.transform = 'none'
                this.currentImage = newImage
            }, 500)
        }, 100)
    }
}
