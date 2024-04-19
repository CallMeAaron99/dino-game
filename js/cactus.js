import { getCustomProperty, incrementCustomProperty, randomNumberBetween, setCustomProperty } from "./util.js"

const SPEED = 0.05
const CACTUS_INTERVAL_MIN = 500
const CACTUS_INTERVAL_MAX = 2000
const worldElem = document.querySelector("[data-world]")

let nextCactusTime

export default class Cactus {
    constructor(speed, min_interval, max_interval, worldElem) {
        this.speed = speed
        this.min_interval = min_interval
        this.max_interval = max_interval
        this.worldElem = worldElem
        this.nextCactusTime = min_interval
    }

    reset() {
        this.nextCactusTime = this.min_interval
        document.querySelectorAll("[data-cactus]").forEach(cactus => {
            cactus.remove()
        })
    }

    update(delta, speedScale) {
        document.querySelectorAll("[data-cactus]").forEach(cactus => {
            incrementCustomProperty(cactus, "--left", delta * speedScale * this.speed * -1)
            if (getCustomProperty(cactus, "--left") <= -100) {
                cactus.remove()
            }
        })

        if (this.nextCactusTime <= 0) {
            this.#create()
            this.nextCactusTime = randomNumberBetween(this.min_interval, this.max_interval) / speedScale
        }
        this.nextCactusTime -= delta
    }

    rects() {
        return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
            return cactus.getBoundingClientRect()
        })
    }

    #create() {
        const cactus = document.createElement("img")
        cactus.dataset.cactus = true
        cactus.src = "images/cactus.png"
        cactus.classList.add("cactus")
        setCustomProperty(cactus, "--left", 100)
        this.worldElem.append(cactus)
    }
}
