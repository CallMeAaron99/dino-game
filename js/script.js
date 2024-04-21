import Cactus from './cactus.js'
import Dino from './dino.js'
import Ground from './ground.js'
import { isCollision } from './util.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001
const DINO_JUMP_SPEED = 0.45
const DINO_GRAVITY = 0.0015
const SPEED = 0.05
const CACTUS_INTERVAL_MIN = 800
const CACTUS_INTERVAL_MAX = 2000
const worldElem = document.getElementById("world")
const scoreElem = document.getElementById("score")
const startScreenElem = document.getElementById("start-screen")

const dino = new Dino(DINO_JUMP_SPEED, DINO_GRAVITY)
const cactus = new Cactus(SPEED, CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX, worldElem)
const ground = new Ground(SPEED)

let lastTime = null
let speedScale = 1
let score = 0

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handelStart, { once: true })

function update(time) {
    // Skip first loop
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateSpeedScale(delta)
    updateScore(delta)
    ground.update(delta, speedScale)
    dino.update(delta, speedScale)
    cactus.update(delta, speedScale)

    if (isLost()) return handelLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function handelLose() {
    dino.setLose()
    // Prevent instant start
    setTimeout(() => {
        document.addEventListener("keydown", handelStart, { once: true })
        startScreenElem.classList.remove("hide")
    }, 100)
}

function isLost() {
    const dinoRect = dino.getRect()
    return cactus.rects().some(rect => isCollision(rect, dinoRect))
}

function updateScore(delta) {
    score += delta * 0.001
    scoreElem.textContent = Math.floor(score)
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function handelStart() {
    lastTime = null
    score = 0
    ground.reset()
    dino.reset()
    cactus.reset()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}