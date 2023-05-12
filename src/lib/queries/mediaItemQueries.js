

 export const queries = {
  MPEGs: `query GetMusicFromCMS {
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