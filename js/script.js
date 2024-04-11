import { getCactusRects, setupCactus, updateCactus } from './cactus.js'
import { getDinoRect, setDinoLose, setupDino, updateDino } from './dino.js'
import { setupGround, updateGround } from './ground.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

let lastTime = null
let speedScale = 1
let score = 0

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handelStart, { once: true })

function update(time) {
    if (lastTime === null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateGround(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    updateDino(delta, speedScale)
    updateCactus(delta, speedScale)

    if (checkLost()) return handelLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function handelLose() {
    setDinoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handelStart, { once: true })
        startScreenElem.classList.remove("hide")
    }, 100)
}

function checkLost() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
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
    setupGround()
    setupDino()
    setupCactus()
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