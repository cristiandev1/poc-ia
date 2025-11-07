export interface ParsedCommit {
  commitType: string;
  jiraId: string;
  aiTool: 'copilot' | 'devin' | 'no-ai' | null;
  description: string;
  isValid: boolean;
}

/**
 * Parses commit message with pattern: [type/JIRA-ID][ai-tool] - description
 * Example: [feat/BANK-123][copilot] - implementa transferência
 */
export function parseCommitMessage(message: string): ParsedCommit {
  // Pattern: [type/ID][ai-tool] - description
  const pattern = /^\[([^/]+)\/([^\]]+)\]\[(copilot|devin|no-ai)\]\s*-?\s*(.+)$/i;
  const match = message.match(pattern);

  if (!match) {
    return {
      commitType: '',
      jiraId: '',
      aiTool: null,
      description: message,
      isValid: false,
    };
  }

  const [, commitType, jiraId, aiTool, description] = match;

  return {
    commitType: commitType.trim(),
    jiraId: jiraId.trim().toUpperCase(),
    aiTool: aiTool.toLowerCase() as 'copilot' | 'devin' | 'no-ai',
    description: description.trim(),
    isValid: true,
  };
}

/**
 * Validates if commit follows the expected pattern
 */
export function isValidCommitFormat(message: string): boolean {
  return parseCommitMessage(message).isValid;
}

/**
 * Generates example commit message
 */
export function getCommitExample(): string {
  return '[feat/BANK-123][copilot] - implementa validação de transferência';
}
