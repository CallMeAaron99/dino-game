import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./util.js"

export default class Dino {
    constructor(jumpSpeed, gravity) {
        this.dinoElem = document.getElementById("dino")
        this.jumpSpeed = jumpSpeed
        this.gravity = gravity
        this.dino_frame_count = 2
        this.frame_time = 100
        this.isJumping = false
        this.yVelocity = 0
        this.dinoFrame = 0
        this.currentFrameTime = 0
    }

    reset() {
        this.isJumping = false
        this.yVelocity = 0
        this.dinoFrame = 0
        this.currentFrameTime = 0
        setCustomProperty(this.dinoElem, "--bottom", 0)
        document.removeEventListener("keydown", this.#onJump)
        document.addEventListener("keydown", this.#onJump)
    }

    update(delta, speedScale) {
        this.#handelRun(delta, speedScale)
        this.#handelJump(delta)
    }

    getRect() {
        return this.dinoElem.getBoundingClientRect()
    }

    setLose() {
        this.dinoElem.src = "images/dino-lose.png"
    }

    #handelRun(delta, speedScale) {
        if (this.isJumping) {
            this.dinoElem.src = "images/dino-stationary.png"
            return
        }

        if (this.currentFrameTime >= this.frame_time) {
            this.dinoFrame = (this.dinoFrame + 1) % this.dino_frame_count
            this.dinoElem.src = `images/dino-run-${this.dinoFrame}.png`
            this.currentFrameTime -= this.frame_time
        }
        this.currentFrameTime += speedScale * delta
    }

    #handelJump(delta) {
        if (!this.isJumping) return

        incrementCustomProperty(this.dinoElem, "--bottom", this.yVelocity * delta)

        // Touch ground
        if (getCustomProperty(this.dinoElem, "--bottom") <= 0) {
            setCustomProperty(this.dinoElem, "--bottom", 0)
            this.isJumping = false
            return
        }

        this.yVelocity -= this.gravity * delta
    }

    #onJump = (e) => {
        if(e.code !== "Space" || this.isJumping) return
        
        this.yVelocity = this.jumpSpeed
        this.isJumping = true
    }
}