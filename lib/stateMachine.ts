export enum ConversationState {
  START = 'START',
  
  // Student Path
  STUDENT_YEAR = 'STUDENT_YEAR',
  STUDENT_GOAL = 'STUDENT_GOAL',
  STUDENT_INTEREST = 'STUDENT_INTEREST',
  STUDENT_PAIN = 'STUDENT_PAIN',
  
  // College Path
  COLLEGE_COUNT = 'COLLEGE_COUNT',
  COLLEGE_LABS = 'COLLEGE_LABS',
  COLLEGE_BUDGET = 'COLLEGE_BUDGET',
  COLLEGE_PILOT = 'COLLEGE_PILOT',

  // Professional Path
  PROFESSIONAL_ROLE = 'PROFESSIONAL_ROLE',
  PROFESSIONAL_GOAL = 'PROFESSIONAL_GOAL',
  PROFESSIONAL_PAIN = 'PROFESSIONAL_PAIN',

  // Generic Path
  OTHER_HELP = 'OTHER_HELP',
  
  // Lead Capture (Shared)
  LEAD_NAME = 'LEAD_NAME',
  LEAD_PHONE = 'LEAD_PHONE',
  LEAD_EMAIL = 'LEAD_EMAIL',
  LEAD_COLLEGE = 'LEAD_COLLEGE',
  
  FINISH = 'FINISH',
  COMPLETED = 'COMPLETED'
}

export interface LeadCaptured {
  name: string | null;
  phone: string | null;
  email: string | null;
  college: string | null;
}

export interface StructuredState {
  userType: 'Student' | 'College' | 'Professional' | 'Other' | null;
  goal: string | null;
  painPoint: string | null;
  interest: string | null;
  intent: string | null;
  leadCaptured: LeadCaptured;
}

export interface ComplianceAudit {
  sentenceCount: number;
  hasForbidden: boolean;
  isSentenceOk: boolean;
  isVocabularyOk: boolean;
  allOk: boolean;
}

export const FORBIDDEN_WORDS = [
  "guaranteed",
  "100%",
  "best",
  "revolutionary",
  "best opportunity",
  "pakka milega",
  "100% placement",
  "guarantee",
  "pakka"
];

export function createDefaultState(): StructuredState {
  return {
    userType: null,
    goal: null,
    painPoint: null,
    interest: null,
    intent: null,
    leadCaptured: {
      name: null,
      phone: null,
      email: null,
      college: null
    }
  };
}

export function checkCompliance(text: string): ComplianceAudit {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const sentenceCount = sentences.length;
  
  const lowerText = text.toLowerCase();
  let hasForbidden = false;
  for (const word of FORBIDDEN_WORDS) {
    if (lowerText.includes(word)) {
      hasForbidden = true;
      break;
    }
  }

  const isSentenceOk = sentenceCount <= 2;
  const isVocabularyOk = !hasForbidden;

  return {
    sentenceCount,
    hasForbidden,
    isSentenceOk,
    isVocabularyOk,
    allOk: isSentenceOk && isVocabularyOk
  };
}

export function checkHandoffRequest(text: string): boolean {
  const lowerText = text.toLowerCase();
  const humanKeywords = ["human", "person", "counsellor", "counselor", "coordinator", "agent", "support", "representative", "talk to someone", "speak to someone", "call me"];
  const distressKeywords = ["distressed", "angry", "frustrated", "error", "not working", "stupid", "useless", "waste of time", "hate this", "help me please", "stuck"];
  
  const hasHuman = humanKeywords.some(keyword => lowerText.includes(keyword));
  const hasDistress = distressKeywords.some(keyword => lowerText.includes(keyword));
  
  return hasHuman || hasDistress;
}
