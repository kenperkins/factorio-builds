import { IBuild, EState, ECategory } from "../types"

export const mockedBuilds: IBuild[] = [
  {
    id: "1",
    blueprint: "asdf",
    name: "8x8 balancer",
    state: EState.EARLY_GAME,
    categories: [ECategory.BALANCER],
    tileable: false,
  },
  {
    id: "2",
    blueprint: "asdf",
    name: "1-4 train loading",
    state: EState.MID_GAME,
    categories: [ECategory.BALANCER],
    tileable: false,
  },
  {
    id: "3",
    blueprint: "asdf",
    name: "tileable green circuit production",
    state: EState.EARLY_GAME,
    categories: [ECategory.PRODUCTION],
    tileable: true,
  },
  {
    id: "4",
    blueprint: "asdf",
    name: "beaconed green circuit production",
    state: EState.LATE_GAME,
    categories: [ECategory.PRODUCTION],
    tileable: true,
  },
]
