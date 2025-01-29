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
  id: string
  sender_id: string
  timestamp: Date
  songlink: string
  note: string
  rating: number
}
