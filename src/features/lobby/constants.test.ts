import { describe, expect, it } from "vitest"

import { estimateGameDuration, formatTime } from "./constants"

describe("formatTime", () => {
  it("formats base+increment", () => {
    expect(formatTime({ base: 5, increment: 3 })).toBe("5+3")
  })

  it("formats zero increment", () => {
    expect(formatTime({ base: 1, increment: 0 })).toBe("1+0")
  })
})

describe("estimateGameDuration", () => {
  it("estimates bullet game (~2min for 1+0)", () => {
    // (1*60 + 40*0) * 2 = 120s = 2min
    expect(estimateGameDuration({ base: 1, increment: 0 })).toBe("~2min")
  })

  it("estimates blitz game (~14min for 5+3)", () => {
    // (5*60 + 40*3) * 2 = (300+120)*2 = 840s = 14min
    expect(estimateGameDuration({ base: 5, increment: 3 })).toBe("~14min")
  })

  it("estimates rapid game (~43min for 15+10)", () => {
    // (15*60 + 40*10) * 2 = (900+400)*2 = 2600s ≈ 43min
    expect(estimateGameDuration({ base: 15, increment: 10 })).toBe("~43min")
  })

  it("estimates bullet game (~5min for 2+1)", () => {
    // (2*60 + 40*1) * 2 = (120+40)*2 = 320s ≈ 5min
    expect(estimateGameDuration({ base: 2, increment: 1 })).toBe("~5min")
  })

  it("estimates blitz game (~11min for 3+2)", () => {
    // (3*60 + 40*2) * 2 = (180+80)*2 = 520s ≈ 9min
    expect(estimateGameDuration({ base: 3, increment: 2 })).toBe("~9min")
  })
})
