import { getCustomProperty, incrementCustomProperty, randomNumberBetween, setCustomProperty } from "./util.js"

export default class Cactus {
    constructor(speed, min_interval, max_interval, worldElem) {
        this.speed = speed
        this.min_interval = min_interval
        this.max_interval = max_interval
        this.worldElem = worldElem
        this.nextCactusTime = min_interval
    }

    reset() {
        this.nextCactusTime = this.min_interval // Spawn cactus asap
        // Clear cactus
        document.querySelectorAll("[data-cactus]").forEach(cactus => {
            cactus.remove()
        })
    }

    update(delta, speedScale) {
        document.querySelectorAll("[data-cactus]").forEach(cactus => {
            // Update cactus position
            incrementCustomProperty(cactus, "--left", delta * speedScale * this.speed * -1)
            
            // Remove cactuses that are out of screen
            if (getCustomProperty(cactus, "--left") <= -100) {
                cactus.remove()
            }
        })

        // Spawn cactus when time reaches 0
        if (this.nextCactusTime <= 0) {
            this.#create()
            this.nextCactusTime = randomNumberBetween(this.min_interval, this.max_interval) / speedScale
        }
        this.nextCactusTime -= delta
    }

    rects() {
        /*
            rects structure:
            [
                {x: 0, y: 0, ...},
                {x: 0, y: 0, ...}
            ]
        */
        return [...document.querySelectorAll("[data-cactus]")].map(cactus => cactus.getBoundingClientRect())
    }

    #create() {
        const cactus = document.createElement("img")
        cactus.dataset.cactus = ""
        cactus.src = "images/cactus.png"
        cactus.classList.add("cactus")
        setCustomProperty(cactus, "--left", 100)
        this.worldElem.append(cactus)
    }
}
