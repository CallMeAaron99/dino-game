import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./util.js"

export default class Ground {
    constructor(speed) {
        this.groundElems = document.querySelectorAll("[data-ground]")
        this.speed = speed
    }

    reset() {
        for (let i = 0; i < this.groundElems.length; i++) {
            // Spawn grounds
            setCustomProperty(this.groundElems[i], "--left", i * 300)
        }
    }

    update(delta, speedScale) {
        this.groundElems.forEach(ground => {
            // Update grounds position
            incrementCustomProperty(ground, "--left", delta * speedScale * this.speed * -1)

            // Remove grounds that are out of screen
            if (getCustomProperty(ground, "--left") <= -300) {
                incrementCustomProperty(ground, "--left", 600)
            }
        })
    }
}