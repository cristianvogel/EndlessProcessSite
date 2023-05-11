

 export const queries = {
  music: `query GetMusicFromCMS {
  mediaItems(where: {mimeType: AUDIO_MPEG}) {
    edges {
      node {
        mediaItemUrl
        fileSize
        caption
        title
      }
    }
  }
}`,
  speech:`query GetSpeechFromCMS {
  mediaItems(where: {mimeType: AUDIO_MPEG}) {
    edges {
      node {
        mediaItemUrl
        fileSize
        caption
        title
        Speech {
          chapter
        }
      }
    }
  }
}`
  
}