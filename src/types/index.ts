export type SessionStatus = 'CREATED' | 'AI_SERVING' | 'HUMAN_SERVING' | 'CLOSED' | 'EVALUATED'

export type HandlerType = 'AI' | 'HUMAN'

export type MsgSenderType = 'USER' | 'AI' | 'AGENT' | 'SYSTEM'

export type MsgType = 'TXT' | 'IMG' | 'FILE'

export interface ApiResult<T = any> {
  code: number
  msg: string
  data: T
}

export interface ChatMessage {
  id: string
  msgId?: string
  senderType: MsgSenderType
  senderId: string
  senderName?: string
  avatar?: string
  msgType: MsgType
  content: string
  status: 'sending' | 'sent' | 'failed'
  createTime: string
  bizType?: string
  ext?: Record<string, any>
}

export interface SessionInfo {
  sessionId: string
  groupId: string
  status: SessionStatus
  handlerType: HandlerType
  aiAccount: { id: string; nickname: string }
  agent?: { id: string; nickname: string; avatar?: string }
  welcome?: string
  queuePosition: number
}

export interface StartSessionResp {
  sessionId: string
  groupId: string
  status: SessionStatus
  handlerType: HandlerType
  aiAccount?: { id: string; nickname: string }
  aiAccountId?: string
  aiNickname?: string
  welcome: string
}

export interface GuestTokenResp {
  token: string
  userId: string
  easemobToken: string
  expiresIn: number
}
