import { invoke } from '@tauri-apps/api/core';

export interface FirstRunOption {
  id: string;
  title: string;
  subtitle: string;
  kind: string;
  recommended: boolean;
  requires_key: boolean;
  requires_download: boolean;
}

export interface FirstRunPlan {
  title: string;
  whisper: string;
  philosophy: string;
  options: FirstRunOption[];
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatRequest {
  provider: string;
  model: string;
  base_url: string;
  messages: ChatMessage[];
  stream: boolean;
  key_ref?: string;
}

export interface StreamChunk {
  event_type: string;
  content?: string;
  message?: string;
}

export interface StreamResponse {
  provider: string;
  model: string;
  chunks: StreamChunk[];
  full_content: string;
}

export async function getFirstRunPlan(): Promise<FirstRunPlan> {
  return invoke<FirstRunPlan>('lyacodex_first_run_plan');
}

export async function getWakeRitual() {
  return invoke('lyacodex_wake_ritual');
}

export async function previewChatRequest(): Promise<ChatRequest> {
  return invoke<ChatRequest>('lyacodex_preview_chat_request');
}

export async function streamCollect(request: ChatRequest): Promise<StreamResponse> {
  return invoke<StreamResponse>('lyacodex_chat_stream_collect', { request });
}
