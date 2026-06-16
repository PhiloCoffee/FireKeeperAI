import fireKeeperArt from "./assets/char/fire-keeper/fire-keeper-art-rashed-alakroka.jpg";
import bonfireBanner from "./assets/object/bonfire/bg-bonfire-ruins-cropped-banner.jpg";
import anorLondoSkyline from "./assets/scene/local-screenshots/bg-anor-londo-skyline.jpg";
import anorLondoCathedral from "./assets/scene/local-screenshots/bg-anor-londo-cathedral.jpg";
import undeadBurg from "./assets/scene/dark-souls-remastered/dark-souls-remastered-screenshot-02.jpg";
import lordranBridge from "./assets/scene/dark-souls-remastered/dark-souls-remastered-screenshot-04.jpg";
import lothricWall from "./assets/scene/dark-souls-iii/dark-souls-iii-screenshot-03.jpg";
import ds3Ash from "./assets/scene/dark-souls-iii/dark-souls-iii-screenshot-08.jpg";
import ds3PreorderTrailerHls from "./assets/official/steam-videos/ds3-preorder-trailer-hls-master.m3u8?url";
import ds3PreorderTrailerPoster from "./assets/official/steam-videos/ds3-preorder-trailer-poster.jpg";
import ds3TheMovieHls from "./assets/official/steam-videos/ds3-the-movie-hls-master.m3u8?url";
import ds3TheMoviePoster from "./assets/official/steam-videos/ds3-the-movie-poster.jpg";
import dsrLaunchTrailerHls from "./assets/official/steam-videos/dsr-launch-trailer-hls-master.m3u8?url";
import dsrLaunchTrailerPoster from "./assets/official/steam-videos/dsr-launch-trailer-poster.jpg";
import {
  getMediaById as getMediaDefinitionById,
  getModeById,
  getNextModeId,
  INTERACTION_MODES,
  OFFICIAL_MEDIA_ASSETS,
  PERSONA_TEMPLATE_DEFINITIONS
} from "./personaTemplateData.js";

const personaAssets = {
  anorLondoSkyline,
  anorLondoCathedral,
  bonfireBanner,
  ds3Ash,
  fireKeeperArt,
  lordranBridge,
  lothricWall,
  undeadBurg
};

const mediaAssets = {
  ds3PreorderTrailerHls,
  ds3PreorderTrailerPoster,
  ds3TheMovieHls,
  ds3TheMoviePoster,
  dsrLaunchTrailerHls,
  dsrLaunchTrailerPoster
};

export { getModeById, getNextModeId, INTERACTION_MODES, OFFICIAL_MEDIA_ASSETS };

export const PERSONA_TEMPLATES = PERSONA_TEMPLATE_DEFINITIONS.map((persona) => ({
  ...persona,
  scene: personaAssets[persona.sceneKey],
  banner: personaAssets[persona.bannerKey],
  portrait: persona.portraitKey ? personaAssets[persona.portraitKey] : null
}));

export function getPersonaById(id) {
  return PERSONA_TEMPLATES.find((persona) => persona.id === id) || PERSONA_TEMPLATES[0];
}

export function getMediaById(id) {
  const media = getMediaDefinitionById(id);

  return {
    ...media,
    localPoster: mediaAssets[media.localPosterKey],
    localHls: mediaAssets[media.localHlsKey]
  };
}
