export interface SpotifyUserData {
  country: string
  display_name: string
  email: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  href: string
  id: string
  images: SpotifyImage[]
  product: string
  type: string
  uri: string
}

export interface SpotifyTrack {
  // From https://developer.spotify.com/documentation/web-api/reference/get-track
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

export interface SpotifyAlbum {
  // From https://developer.spotify.com/documentation/web-api/reference/get-an-album
  album_type: string
  artists: SpotifyArtist[]
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface SpotifyArtist {
  // From https://developer.spotify.com/documentation/web-api/reference/get-an-artist
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  genres: string[]
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  popularity: number
  type: string
  uri: string
}

export interface SpotifyImage {
  height: number
  url: string
  width: number
}

export interface SpotifySearchResult {
  tracks: {
    href: string
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
    items: SpotifyTrack[]
  }
}
