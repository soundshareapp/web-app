export interface ChatData {
  id: string
  userdata: {
    id: string
    name: string
    username: string
    avatar: string
  }
  timestamp: number
}

export interface MessageData {
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

