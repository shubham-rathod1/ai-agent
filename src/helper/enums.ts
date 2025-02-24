enum AgentType {
  PRODUCTIVE = 'productive',
  ENTERTAINMENT = 'entertainment',
  ONCHAIN = 'onchain',
  INFORMATION = 'information',
  CREATIVE = 'creative',
}

enum SignatureType {
  Solana = 'Solana',
  // Tron = 'Tron',
  EVM = 'EVM',
  // Cosmos = 'Cosmos',
}

enum KbTypes {
  TEXT = 'text',
  URL = 'url',
  FILE = 'file',
}

enum SubscriptionTypes {
  FREE = 'free',
  PRO = 'pro',
  PLUS = 'plus',
}

enum ModelId {
  OPENAI = 'openai',
  GROG = 'groq',
}

enum BrowserType {
  DUCK = 'duck',
  BRAVE = 'brave',
  GOOGLE = 'google',
}

export { AgentType, SignatureType, KbTypes, SubscriptionTypes, ModelId,BrowserType };
