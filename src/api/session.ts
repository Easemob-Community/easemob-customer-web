import request from './request'
import type { ApiResult, GuestTokenResp, StartSessionResp } from '@/types'

export function guestToken(params: {
  userId?: string
  nickname?: string
  channel?: string
  deviceId?: string
}): Promise<ApiResult<GuestTokenResp>> {
  return request.post('/open/auth/guest-token', params)
}

export function startSession(params: {
  userId: string
  channel: string
  skillGroupId?: number
  metadata?: Record<string, any>
}): Promise<ApiResult<StartSessionResp>> {
  return request.post('/open/session/start', params)
}

export function transferSession(params: {
  sessionId: string
  userId: string
  reason?: string
}): Promise<ApiResult<void>> {
  return request.post('/open/session/transfer', params)
}

export function closeSession(sessionId: string): Promise<ApiResult<void>> {
  return request.post('/open/session/close', { sessionId })
}

export function evaluate(params: {
  sessionId: string
  score: number
  tags?: string[]
  comment?: string
}): Promise<ApiResult<void>> {
  return request.post('/open/session/evaluate', params)
}

export function recordMessage(params: {
  sessionId: string
  msgId?: string
  type?: string
  content: string
}): Promise<ApiResult<void>> {
  return request.post('/open/message/record', params)
}

export function history(params: {
  sessionId: string
  beforeMsgId?: string
  size?: number
}): Promise<ApiResult<{ list: any[]; cursor?: string }>> {
  return request.get('/open/message/history', { params })
}
