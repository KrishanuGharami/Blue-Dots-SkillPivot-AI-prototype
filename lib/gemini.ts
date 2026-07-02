import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { StructuredState, ConversationState, checkCompliance, FORBIDDEN_WORDS, checkHandoffRequest } from "./stateMachine";

const apiKey = process.env.GEMINI_API_KEY || "";
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn("GEMINI_API_KEY is not defined. Gemini client is in mock mode.");
}

// Structured output schema definition
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    reply: {
      type: SchemaType.STRING,
      description: "Friendly, direct conversational reply under two sentences. Must not contain words like guaranteed, 100%, best, revolutionary, or pakka."
    },
    newState: {
      type: SchemaType.STRING,
      description: "The next ConversationState to transition to based on the flow."
    },
    stateUpdate: {
      type: SchemaType.OBJECT,
      description: "Any new fields captured in this turn. Only include updated fields.",
      properties: {
        userType: { type: SchemaType.STRING, nullable: true },
        goal: { type: SchemaType.STRING, nullable: true },
        painPoint: { type: SchemaType.STRING, nullable: true },
        interest: { type: SchemaType.STRING, nullable: true },
        intent: { type: SchemaType.STRING, nullable: true },
        leadCaptured: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING, nullable: true },
            phone: { type: SchemaType.STRING, nullable: true },
            email: { type: SchemaType.STRING, nullable: true },
            college: { type: SchemaType.STRING, nullable: true }
          }
        }
      }
    }
  },
  required: ["reply", "newState"]
};

const SYSTEM_INSTRUCTION = `
You are the SkillPivot AI Discovery Guide voice assistant for the Blue Dots Economy Market Discovery Challenge.
Your goal is to guide visitors through a brief discovery flow to capture user demographics, technology interests, pain points, and lead details, then offer them a tailored recommendation.

Branching Logic:
1. Initial Greeting: State that this session may be recorded. Ask if they are exploring technology skills as a student, representing a college/university, or as a working professional.
2. Student Branch:
   - State STUDENT_YEAR: Ask for enrollment year (1st, 2nd, 3rd, 4th, etc.).
   - State STUDENT_GOAL: Ask for their main career target after graduation.
   - State STUDENT_INTEREST: Ask which domain excites them (Robotics, AI, IoT, Web Dev, etc.).
   - State STUDENT_PAIN: Ask for their biggest learning barrier (no lab access, confusing tutorials, high fees, etc.).
   - State LEAD_NAME: State that you are saving their details to connect them with a lab. Recommend a lab based on interest (Remote Robotics Lab for Robotics, AI Lab for AI, IoT Lab for IoT/embedded, Demo for others). Ask for their full name.
3. College Representative Branch:
   - State COLLEGE_COUNT: Ask for approximate student enrollment.
   - State COLLEGE_LABS: Ask about their existing practical lab setups (AI/Robotics/IoT).
   - State COLLEGE_BUDGET: Ask for budget scope (Flexible, Under 2L, 2-5L, Above 5L).
   - State COLLEGE_PILOT: Ask if they are interested in a short trial pilot lab.
   - State LEAD_NAME: State that you are saving their details to connect them with our team. Recommend a program (College Pilot if pilot interested, Founder Meeting if budget is above 5L/flexible, Demo Session otherwise). Ask for full name.
4. Working Professional Branch:
   - State PROFESSIONAL_ROLE: Ask for their current professional job role or technical background.
   - State PROFESSIONAL_GOAL: Ask for their main career goal or technology stack transition.
   - State PROFESSIONAL_PAIN: Ask for their biggest learning barrier or schedule constraint.
   - State LEAD_NAME: State that you are saving their details to connect them with our upskilling team. Recommend a program (AI & Machine Learning Program for AI/ML goals, Full Stack Career Program for web dev, DevOps Career Program for Cloud/DevOps, Upskill Demo otherwise). Ask for full name.
5. Lead Capture Phase (for all branches):
   - State LEAD_PHONE: State that you are registering their number to coordinate a demo. Ask for WhatsApp or mobile contact number.
   - State LEAD_EMAIL: State that you are registering their email for session details. Ask for their email address.
   - State LEAD_COLLEGE: Ask for their college name or current company/workplace.
6. Final CTA Offer:
   - Recommend scheduling a demo or connecting on WhatsApp. State "FINISH" when offering.

Strict Rules & Guardrails:
- Your response ('reply') MUST be under two sentences.
- Speak in a friendly, conversational voice of a knowledgeable, calm friend — not a help desk or an automated IVR menu. Use short, simple sentences.
- Be transparent about data sharing and recording by stating what you are doing as you do it, rather than asking for permission.
- Ask only one thing at a time. Build the profile progressively. Never ask for location/phone/email/trade in the same turn.
- NEVER make absolute claims or promises. Do not use forbidden phrases: "guaranteed", "100%", "best", "revolutionary", "best opportunity", "pakka milega", "100% placement", "guarantee", "pakka". If they appear in your draft, replace them with synonyms.
- Present all salary ranges or job readiness outcomes as ranges, never as guarantees.
- If the user asks for a human, indicates distress/frustration, or says they are stuck, immediately state: 'I understand. I am handing you over to a student coordinator. Our team will reach out to you within 24 hours.' and transition to 'FINISH' state.
- Return the next conversation state name (e.g. STUDENT_YEAR, STUDENT_GOAL, LEAD_NAME, FINISH, etc.) in the 'newState' property.
`;

export async function askGemini(
  history: Array<{ role: 'user' | 'model'; parts: string }>,
  currentState: ConversationState,
  structuredState: StructuredState
): Promise<{ reply: string; newState: ConversationState; stateUpdate: Partial<StructuredState> }> {
  
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
        systemInstruction: SYSTEM_INSTRUCTION
      });

      // Prepare context for Gemini
      const prompt = `
Current Conversation State: ${currentState}
Current Captured JSON State: ${JSON.stringify(structuredState)}

Please process the user's latest message and return the JSON response.
`;

      const contents = [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.parts }]
        })),
        { role: "user", parts: [{ text: prompt }] }
      ];

      const result = await model.generateContent({ contents });
      const text = result.response.text();
      const parsed = JSON.parse(text);
      
      return {
        reply: parsed.reply,
        newState: parsed.newState as ConversationState,
        stateUpdate: parsed.stateUpdate || {}
      };
    } catch (error) {
      console.error("Gemini Live API error, falling back to mock processor:", error);
      return runMockProcessor(history[history.length - 1]?.parts || "", currentState, structuredState);
    }
  } else {
    // Return mock response
    return runMockProcessor(history[history.length - 1]?.parts || "", currentState, structuredState);
  }
}

// Highly reliable Local State Machine Emulator (Mock Gemini)
export function runMockProcessor(
  userInput: string,
  currentState: ConversationState,
  currentStructuredState: StructuredState
): { reply: string; newState: ConversationState; stateUpdate: Partial<StructuredState> } {
  
  const text = userInput.trim();
  const textLower = text.toLowerCase();
  
  // Check for distress or explicit human request first
  if (checkHandoffRequest(userInput)) {
    return {
      reply: "I understand. I am handing you over to a student coordinator. Our team will contact you within 24 hours to help.",
      newState: ConversationState.FINISH,
      stateUpdate: { intent: "Human Handoff Triggered" }
    };
  }

  let reply = "";
  let newState = currentState;
  let stateUpdate: Partial<StructuredState> = {};

  switch (currentState) {
    case ConversationState.START:
      if (textLower.includes('stud') || textLower === '1') {
        stateUpdate.userType = 'Student';
        newState = ConversationState.STUDENT_YEAR;
        reply = "Got it. Which year of study are you in currently?";
      } else if (textLower.includes('coll') || textLower.includes('inst') || textLower.includes('repres') || textLower === '2') {
        stateUpdate.userType = 'College';
        newState = ConversationState.COLLEGE_COUNT;
        reply = "Understood. Around how many students are currently enrolled in your department or college?";
      } else if (textLower.includes('profession') || textLower.includes('work') || textLower.includes('job') || textLower === '3') {
        stateUpdate.userType = 'Professional';
        newState = ConversationState.PROFESSIONAL_ROLE;
        reply = "Understood. What is your current job role or technical background?";
      } else {
        stateUpdate.userType = 'Other';
        newState = ConversationState.OTHER_HELP;
        reply = "Understood. What is the primary technology goal or skill training you are looking for?";
      }
      break;

    // --- STUDENT FLOW ---
    case ConversationState.STUDENT_YEAR:
      stateUpdate.goal = `Year: ${text}`;
      newState = ConversationState.STUDENT_GOAL;
      reply = "What is your main target after you finish this course?";
      break;

    case ConversationState.STUDENT_GOAL:
      stateUpdate.goal = `${currentStructuredState.goal || ''} | Target: ${text}`;
      newState = ConversationState.STUDENT_INTEREST;
      reply = "Which domain of technology excites you the most?";
      break;

    case ConversationState.STUDENT_INTEREST:
      stateUpdate.interest = text;
      newState = ConversationState.STUDENT_PAIN;
      reply = "What is the biggest barrier you face in learning these topics?";
      break;

    case ConversationState.STUDENT_PAIN:
      stateUpdate.painPoint = text;
      const interest = (currentStructuredState.interest || text).toLowerCase();
      let recLab = "Demo Session";
      if (interest.includes('robot')) recLab = "Remote Robotics Lab";
      else if (interest.includes('ai') || interest.includes('machine')) recLab = "AI Lab";
      else if (interest.includes('iot') || interest.includes('embedded')) recLab = "IoT Lab";
      
      stateUpdate.intent = `Recommended: ${recLab}`;
      newState = ConversationState.LEAD_NAME;
      reply = `I am saving your details to connect you with a lab. I recommend our ${recLab} setup. What is your full name?`;
      break;

    // --- COLLEGE FLOW ---
    case ConversationState.COLLEGE_COUNT:
      stateUpdate.goal = `Students: ${text}`;
      newState = ConversationState.COLLEGE_LABS;
      reply = "Do you have existing practical labs setup for advanced technologies like AI, IoT, or Robotics?";
      break;

    case ConversationState.COLLEGE_LABS:
      stateUpdate.painPoint = `Existing labs: ${text}`;
      newState = ConversationState.COLLEGE_BUDGET;
      reply = "What is the budget scope you are targeting for new hands-on lab deployments?";
      break;

    case ConversationState.COLLEGE_BUDGET:
      stateUpdate.interest = `Budget: ${text}`;
      newState = ConversationState.COLLEGE_PILOT;
      reply = "Would you be interested in running a short-term trial pilot lab with your students?";
      break;

    case ConversationState.COLLEGE_PILOT:
      const pilotInterest = textLower.includes('yes') || textLower.includes('active') || textLower.includes('y');
      const budget = (currentStructuredState.interest || '').toLowerCase();
      let recProgram = "Demo Session";
      if (pilotInterest) recProgram = "College Pilot";
      else if (budget.includes('above 5l') || budget.includes('flexible') || budget.includes('5 lakhs')) recProgram = "Founder Meeting";
      
      stateUpdate.intent = `Pilot Interest: ${text} | Recommended: ${recProgram}`;
      newState = ConversationState.LEAD_NAME;
      reply = `I am saving your details to connect you with our team. I recommend a ${recProgram} setup. What is your full name?`;
      break;

    // --- PROFESSIONAL FLOW ---
    case ConversationState.PROFESSIONAL_ROLE:
      stateUpdate.goal = `Role: ${text}`;
      newState = ConversationState.PROFESSIONAL_GOAL;
      reply = "What is the primary career target or tech stack transition you are aiming for?";
      break;

    case ConversationState.PROFESSIONAL_GOAL:
      stateUpdate.interest = `Target stack: ${text}`;
      newState = ConversationState.PROFESSIONAL_PAIN;
      reply = "What is the biggest learning barrier or schedule constraint you face while upskilling?";
      break;

    case ConversationState.PROFESSIONAL_PAIN:
      stateUpdate.painPoint = text;
      const profGoal = (currentStructuredState.interest || text).toLowerCase();
      let recProfProg = "Upskill Demo";
      if (profGoal.includes('ai') || profGoal.includes('machine') || profGoal.includes('ml')) recProfProg = "AI & Machine Learning Program";
      else if (profGoal.includes('web') || profGoal.includes('full') || profGoal.includes('dev')) recProfProg = "Full Stack Career Program";
      else if (profGoal.includes('devops') || profGoal.includes('cloud') || profGoal.includes('infra')) recProfProg = "DevOps Career Program";
      
      stateUpdate.intent = `Recommended: ${recProfProg}`;
      newState = ConversationState.LEAD_NAME;
      reply = `I am saving your details to connect you with our upskilling team. I recommend our ${recProfProg}. What is your full name?`;
      break;

    // --- OTHER FLOW ---
    case ConversationState.OTHER_HELP:
      stateUpdate.goal = text;
      stateUpdate.painPoint = "Exploring alternative paths";
      stateUpdate.interest = "General technology enablement";
      stateUpdate.intent = "General Contact Session | Recommended: Demo Session";
      newState = ConversationState.LEAD_NAME;
      reply = "I am saving your name to coordinate a session. I recommend we run a Demo Session. What is your full name?";
      break;

    // --- LEAD CAPTURE SYSTEM ---
    case ConversationState.LEAD_NAME:
      stateUpdate.leadCaptured = {
        ...currentStructuredState.leadCaptured,
        name: text
      };
      newState = ConversationState.LEAD_PHONE;
      reply = "I am registering your contact number to coordinate. What is your WhatsApp or mobile number?";
      break;

    case ConversationState.LEAD_PHONE:
      stateUpdate.leadCaptured = {
        ...currentStructuredState.leadCaptured,
        phone: text
      };
      newState = ConversationState.LEAD_EMAIL;
      reply = "I am registering your email for session details. What is your email address?";
      break;

    case ConversationState.LEAD_EMAIL:
      stateUpdate.leadCaptured = {
        ...currentStructuredState.leadCaptured,
        email: text
      };
      newState = ConversationState.LEAD_COLLEGE;
      if (currentStructuredState.userType === 'College') {
        reply = "Which institution or college do you represent?";
      } else if (currentStructuredState.userType === 'Professional') {
        reply = "Which company or current workplace do you represent?";
      } else {
        reply = "Which college or institute are you studying in?";
      }
      break;

    case ConversationState.LEAD_COLLEGE:
      stateUpdate.leadCaptured = {
        ...currentStructuredState.leadCaptured,
        college: text
      };
      stateUpdate.intent = (currentStructuredState.intent || '') + " | Lead Captured Successfully";
      newState = ConversationState.FINISH;
      reply = "I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?";
      break;

    case ConversationState.FINISH:
      stateUpdate.intent = (currentStructuredState.intent || '') + ` | Final Choice: ${text}`;
      newState = ConversationState.COMPLETED;
      reply = "Perfect. I have recorded your preference, and our team will reach out to you shortly.";
      break;

    case ConversationState.COMPLETED:
      reply = "The discovery flow is complete. You can reset the session in the tracker panel to try again.";
      break;
  }

  // Force strict compliance checks on mock output (ensure sentence limit and no forbidden terms)
  const audit = checkCompliance(reply);
  if (!audit.allOk) {
    // If somehow a forbidden word slipped in or it is too long, clean it up manually:
    reply = reply.replace(/guaranteed|100%|best|revolutionary|best opportunity|pakka milega|100% placement|guarantee|pakka/gi, "premier");
    // Trim to 2 sentences
    const sentences = reply.match(/[^.!?]+[.!?]+/g) || [reply];
    if (sentences.length > 2) {
      reply = sentences.slice(0, 2).join(" ");
    }
  }

  return { reply, newState, stateUpdate };
}
