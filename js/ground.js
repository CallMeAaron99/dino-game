import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./util.js"

export default class Ground {
    constructor(speed) {
        this.groundElems = document.querySelectorAll("[data-ground]")
        this.speed = speed
    }

    reset() {
        setCustomProperty(this.groundElems[0], "--left", 0)
        setCustomProperty(this.groundElems[1], "--left", 300)
    }

    update(delta, speedScale) {
        this.groundElems.forEach(ground => {
            incrementCustomProperty(ground, "--left", delta * speedScale * this.speed * -1)

            if (getCustomProperty(ground, "--left") <= -300) {
                incrementCustomProperty(ground, "--left", 600)
            }
        })
    }
}