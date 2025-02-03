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

export { AgentType, SignatureType, KbTypes };
