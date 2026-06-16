export const INTERACTION_MODES = [
  {
    id: "ledger",
    label: "Ledger",
    labelZh: "篝火账本",
    hint: "Capture, sort, and kindle tasks.",
    hintZh: "记录、归类并点燃任务。"
  },
  {
    id: "guidance",
    label: "Guidance",
    labelZh: "引导",
    hint: "Ask for the next step.",
    hintZh: "询问下一步该如何走。"
  },
  {
    id: "ritual",
    label: "Ritual",
    labelZh: "仪式",
    hint: "Use a role-specific working template.",
    hintZh: "使用当前角色的工作模板。"
  },
  {
    id: "archive",
    label: "Archive",
    labelZh: "归档",
    hint: "Review sources and official media.",
    hintZh: "查看来源与官方媒体素材。"
  }
];

export const OFFICIAL_MEDIA_ASSETS = [
  {
    id: "ds3-preorder-trailer",
    title: "Dark Souls III - Pre-Order trailer (EN-ESRB)",
    titleZh: "《黑暗之魂 III》预购预告片（英文 ESRB）",
    sourcePage: "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
    thumbnail:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/256659154/movie.293x165.jpg?t=1700587333",
    hls: "https://video.akamai.steamstatic.com/store_trailers/374320/48797/e6075d14ad252fe2660a62e7c8b7eaf0afa64096/1750520094/hls_264_master.m3u8?t=1700587333",
    localPosterKey: "ds3PreorderTrailerPoster",
    localHlsKey: "ds3PreorderTrailerHls",
    usageNote: "Official Steam store trailer stream; use only for local fan prototype unless licensed."
  },
  {
    id: "ds3-the-movie",
    title: "DS3 _ The Movie (EN-ESRB)",
    titleZh: "《黑暗之魂 III》电影式预告（英文 ESRB）",
    sourcePage: "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
    thumbnail:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/256662354/movie.293x165.jpg?t=1700587383",
    hls: "https://video.akamai.steamstatic.com/store_trailers/374320/55427/16e21902f35c1a672b19ac4668ac02c76317f58d/1750520163/hls_264_master.m3u8?t=1700587383",
    localPosterKey: "ds3TheMoviePoster",
    localHlsKey: "ds3TheMovieHls",
    usageNote: "Official Steam store trailer stream; use only for local fan prototype unless licensed."
  },
  {
    id: "dsr-launch-trailer",
    title: "DARK SOULS: REMASTERED - Launch Trailer",
    titleZh: "《黑暗之魂：重制版》发售预告片",
    sourcePage: "https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/",
    thumbnail:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/257244237/14d7b9caf0961fe394903fdbe7b5d7aa3d2cc6bd/movie_600x337.jpg?t=1764975650",
    hls: "https://video.akamai.steamstatic.com/store_trailers/570940/630464638/1e50fce9cb5c144f01d5ca9ba26f67edd159ee69/1764973946/hls_264_master.m3u8?t=1764975650",
    localPosterKey: "dsrLaunchTrailerPoster",
    localHlsKey: "dsrLaunchTrailerHls",
    usageNote: "Official Steam store trailer stream; use only for local fan prototype unless licensed."
  }
];

export const PERSONA_TEMPLATE_DEFINITIONS = [
  {
    id: "fire-keeper",
    name: "Fire Keeper",
    nameZh: "防火女",
    mark: "FK",
    accent: "#e96b2c",
    sceneKey: "anorLondoSkyline",
    bannerKey: "bonfireBanner",
    portraitKey: "fireKeeperArt",
    mediaId: "ds3-the-movie",
    officialReference:
      "Inspired by official Dark Souls III store language about fading fires, ruin, and embers.",
    officialReferenceZh: "参考《黑暗之魂 III》官方商店关于火焰渐熄、世界破败、余烬尚存的叙事气质。",
    intro: {
      en: "The flame is quiet, but it has not left you. Lay the burden down, and we will tend it one ember at a time.",
      zh: "火焰沉默，却未离你而去。把负担放下，我们一缕余烬一缕余烬地照看。"
    },
    capturePlaceholder: "Offer a task to the flame",
    capturePlaceholderZh: "将任务献给火焰",
    chatPlaceholder:
      "Ask for gentle prioritization, task breakdown, or a calmer next step.",
    chatPlaceholderZh: "询问温和排序、任务拆解，或一个更安定的下一步。",
    ritual: [
      ["Gather the ash", "列出压在心上的所有事项"],
      ["Choose one ember", "只选一个最值得先点燃的任务"],
      ["Kindle, then rest", "完成后点燃它，然后休息"]
    ]
  },
  {
    id: "solaire",
    name: "Solaire of Astora",
    nameZh: "阿斯特拉的索拉尔",
    mark: "SA",
    accent: "#d6aa63",
    sceneKey: "anorLondoCathedral",
    bannerKey: "lordranBridge",
    portraitKey: null,
    mediaId: "dsr-launch-trailer",
    officialReference:
      "Inspired by Lordran's sunlight, pilgrimage, and co-operative summon fantasy.",
    officialReferenceZh: "参考罗德兰的太阳、朝圣与协力召唤气质。",
    intro: {
      en: "A splendid day for impossible work. Raise the sign, find your sun, and take the next bright swing.",
      zh: "多么适合挑战不可能的一天。留下召唤印，找到你的太阳，再挥出明亮的一击。"
    },
    capturePlaceholder: "Name the quest worth praising",
    capturePlaceholderZh: "写下值得赞美的任务",
    chatPlaceholder: "Ask for optimistic planning, momentum, or a brave first move.",
    chatPlaceholderZh: "询问乐观计划、推进节奏，或勇敢的第一步。",
    ritual: [
      ["Praise the objective", "用一句话说清目标为何值得做"],
      ["Place the summon sign", "标出需要协助或资源的位置"],
      ["Walk toward the sun", "立刻推进一个可见的小动作"]
    ]
  },
  {
    id: "chosen-undead",
    name: "Chosen Undead",
    nameZh: "天选不死人",
    mark: "CU",
    accent: "#879db3",
    sceneKey: "undeadBurg",
    bannerKey: "lothricWall",
    portraitKey: null,
    mediaId: "dsr-launch-trailer",
    officialReference:
      "Inspired by official Dark Souls Remastered language around a deep, dark universe and repeated beginnings.",
    officialReferenceZh: "参考《黑暗之魂：重制版》官方商店关于幽深黑暗宇宙与不断重新开始的表达。",
    intro: {
      en: "You may fall, but the route remembers. Mark the shortcut, learn the pattern, and return sharper.",
      zh: "你会倒下，但道路会记住你。标出捷径，学会节奏，然后更锋利地回来。"
    },
    capturePlaceholder: "Mark the next obstacle",
    capturePlaceholderZh: "标记下一个阻碍",
    chatPlaceholder: "Ask for retries, risk reading, or a route through blockers.",
    chatPlaceholderZh: "询问重试方案、风险判断，或穿过阻塞的路线。",
    ritual: [
      ["Read the arena", "判断当前局面和限制"],
      ["Recover the souls", "找回已经投入的成果"],
      ["Open the shortcut", "创造下次更快通过的捷径"]
    ]
  },
  {
    id: "siegmeyer",
    name: "Siegmeyer of Catarina",
    nameZh: "卡塔利纳的洋葱骑士",
    mark: "SC",
    accent: "#8da46f",
    sceneKey: "ds3Ash",
    bannerKey: "bonfireBanner",
    portraitKey: null,
    mediaId: "ds3-preorder-trailer",
    officialReference:
      "Inspired by Catarina's patient humor, pauses, and stubborn problem solving.",
    officialReferenceZh: "参考卡塔利纳式的耐心、幽默、停顿与顽固解题气质。",
    intro: {
      en: "Hmm. A puzzle, then. Sit with it, turn it around, and only charge when the opening is honest.",
      zh: "嗯。看来是个难题。先坐一会儿，把它转过来看清楚，等破绽真实出现再冲锋。"
    },
    capturePlaceholder: "Write down the puzzle",
    capturePlaceholderZh: "写下眼前这个难题",
    chatPlaceholder: "Ask for patient debugging, alternatives, or a slower plan.",
    chatPlaceholderZh: "询问耐心排错、备选方案，或更慢但稳的计划。",
    ritual: [
      ["Hmm...", "先停下，承认问题尚未看清"],
      ["Turn the onion", "从三个角度重新描述它"],
      ["Commit to the charge", "选择一个最稳的突破口"]
    ]
  }
];

export function getPersonaDefinitionById(id) {
  return PERSONA_TEMPLATE_DEFINITIONS.find((persona) => persona.id === id) || PERSONA_TEMPLATE_DEFINITIONS[0];
}

export function getModeById(id) {
  return INTERACTION_MODES.find((mode) => mode.id === id) || INTERACTION_MODES[0];
}

export function getNextModeId(currentModeId, direction = 1) {
  const currentIndex = INTERACTION_MODES.findIndex((mode) => mode.id === currentModeId);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = (safeIndex + direction + INTERACTION_MODES.length) % INTERACTION_MODES.length;
  return INTERACTION_MODES[nextIndex].id;
}

export function getMediaById(id) {
  return OFFICIAL_MEDIA_ASSETS.find((asset) => asset.id === id) || OFFICIAL_MEDIA_ASSETS[0];
}
