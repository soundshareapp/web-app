export interface ChatData {
  id: string
  userdata: {
    id: string
    name: string
    username: string
    avatar: string
  }
  timestamp: Date
}

export interface ChatMessage {
  id?: string
  sender_id?: string
  timestamp?: number
  note?: string
  rating?: number
  song: {
    title: string
    artist: string
    album: string
    cover: string
    url: string
  }
}

