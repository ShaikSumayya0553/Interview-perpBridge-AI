import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let aiClient = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Gemini Client Init Warning:', err.message);
  }
}

/**
  High-availability candidate Gemini models list in priority order.
  Includes Flash Lite, Flash, and Pro models to ensure instant response and seamless fallback if rate-limited.
 */
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.1-pro-preview',
  'gemini-pro-latest'
];

/**
 * Helper to strip unnecessary markdown symbols (#, *, **, _, ~, >, emojis) and self-introductions from AI responses.
 * Code blocks (```...```) are protected and left untouched so code syntax is preserved.
 */
export const cleanAIResponseText = (text) => {
  if (!text) return '';

  // Separate code blocks from regular text
  const parts = text.split(/(```[\s\S]*?```)/g);

  const cleanedParts = parts.map((part) => {
    // Leave code blocks completely intact
    if (part.startsWith('```') && part.endsWith('```')) {
      return part;
    }

    let cleaned = part;
    // Remove self-introductions & repeated greetings
    cleaned = cleaned.replace(/^(hello|hi|welcome|greetings)\b[!.,]?\s*/gi, '');
    cleaned = cleaned.replace(/^(i am|i'm|as) (your|a) (technical interview coach|ai interview copilot|prepbridge ai copilot|executive ai)[^.\n]*[.\n]*/gi, '');
    cleaned = cleaned.replace(/^(here is what i can help you master|select a mode above)[^.\n]*[.\n]*/gi, '');

    // Convert LaTeX math formatting like $O(N)$ to O(N)
    cleaned = cleaned.replace(/\$O\(([^)]+)\)\$/g, 'O($1)');
    cleaned = cleaned.replace(/\$O\(([^)]+)\)/g, 'O($1)');

    // Strip markdown headers (#, ##, ###, ####, etc.)
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

    // Strip bold, italic, underline, strikethrough symbols
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
    cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
    cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
    cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1');

    // Strip blockquotes (> text -> text)
    cleaned = cleaned.replace(/^>\s+/gm, '');

    // Strip any leftover stray #, *, ~, _, or > symbols outside code blocks
    cleaned = cleaned.replace(/[*#~>]/g, '');

    // Strip decorative emojis
    cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    return cleaned;
  });

  return cleanedParts.join('').trim();
};

/**
 * Fallback AI response generator for offline or keyless environments
 */
const generateFallbackResponse = (mode, payload) => {
  if (mode === 'chat') {
    const msg = (payload.message || '').trim();
    const lowerMsg = msg.toLowerCase();

    // 1. Behavioral / Personal / Interview Preparation Queries
    if (
      lowerMsg.includes('tell me about yourself') ||
      lowerMsg.includes('introduce') ||
      lowerMsg.includes('project') ||
      lowerMsg.includes('behavioral') ||
      lowerMsg.includes('star') ||
      lowerMsg.includes('conflict') ||
      lowerMsg.includes('weakness') ||
      lowerMsg.includes('strength') ||
      lowerMsg.includes('prepare') ||
      lowerMsg.includes('career')
    ) {
      return `Behavioral & Technical Project Response Guide for "${msg}":

1. The STAR Method Framework:
- Situation: Set the context of your project or situation (role, team size, core problem).
- Task: Define the specific goal or technical challenge assigned to you.
- Action: Highlight your individual technical contributions (frameworks, algorithms, tools, architecture decisions).
- Result: State quantifiable outcomes (e.g., "Reduced page load time by 35%", "Handled 10k daily active users").

2. Recommended 4-Step Speech Blueprint:
- Step 1: 30-Second Professional Elevator Pitch (your background and main tech stack).
- Step 2: Highlight your most impressive technical project & key architectural decisions.
- Step 3: Explain a major engineering hurdle you overcame (debugging, scaling, or team alignment).
- Step 4: Summarize the measurable business or user impact of your work.

3. Key Interviewer Tip:
Always focus heavily on your specific personal actions ("I implemented...", "I architected...") rather than passive team summaries ("We built...").`;
    }

    // 2. Web Development / Frontend (React, JS, Node, CSS, HTML, Web)
    if (
      lowerMsg.includes('react') ||
      lowerMsg.includes('javascript') ||
      lowerMsg.includes('js') ||
      lowerMsg.includes('node') ||
      lowerMsg.includes('frontend') ||
      lowerMsg.includes('backend') ||
      lowerMsg.includes('dom') ||
      lowerMsg.includes('async') ||
      lowerMsg.includes('promise') ||
      lowerMsg.includes('hook') ||
      lowerMsg.includes('api') ||
      lowerMsg.includes('css')
    ) {
      return `Full Stack Technical Breakdown for "${msg}":

1. Core Architecture & Concepts:
- Client-Side Layer: Component hierarchy, state management, and optimized rendering (Reconciliation algorithm / Fiber).
- Asynchronous Execution: Non-blocking Event Loop, Call Stack, Microtask queue (Promises), and Macrotask queue (timers).
- API Integration: RESTful / GraphQL endpoints, authorization headers (JWT/Bearer tokens), and state caching.

2. Code Implementation Pattern:
\`\`\`javascript
// Clean Async Data Fetching & Error Handling Pattern
async function fetchTechnicalData(endpoint) {
  try {
    const response = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(\`HTTP error! Status: \${response.status}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}
\`\`\`

3. Performance & Quality Best Practices:
- Minimize unnecessary re-renders using memoization (\`useMemo\`, \`useCallback\`).
- Implement lazy loading (\`React.lazy\`, code splitting) for large bundle sizes.
- Handle edge cases: null/undefined states, loading spinners, and network disconnects.`;
    }

    // 3. System Design & Distributed Systems
    if (
      lowerMsg.includes('system design') ||
      lowerMsg.includes('url shortener') ||
      lowerMsg.includes('scale') ||
      lowerMsg.includes('scaling') ||
      lowerMsg.includes('load balancer') ||
      lowerMsg.includes('database') ||
      lowerMsg.includes('sql') ||
      lowerMsg.includes('nosql') ||
      lowerMsg.includes('redis') ||
      lowerMsg.includes('kafka') ||
      lowerMsg.includes('microservices') ||
      lowerMsg.includes('cdn') ||
      lowerMsg.includes('cache')
    ) {
      return `System Design Blueprint for "${msg}":

1. High-Level System Architecture:
- Gateway Layer: Rate Limiter & Load Balancers (Nginx / HAProxy) distributing traffic across stateless application instances.
- Core Application Services: Microservices executing business logic and caching hot keys in Redis / Memcached.
- Data Persistence Layer: Primary SQL (PostgreSQL for ACID compliance) or NoSQL (MongoDB / DynamoDB for horizontal scale), coupled with read replicas.

2. Key Scale & Latency Estimations:
- Read-to-Write Ratio: Identify if the system is Read-Heavy (e.g., 100:1) or Write-Heavy.
- Caching Strategy: Cache-aside pattern with TTL invalidation to keep database load under 20%.

3. Architectural Trade-offs:
- CAP Theorem: Prioritize Consistency vs Availability based on system needs (e.g., Banking = Consistency, Social Feed = Availability).`;
    }

    // 4. Data Structures & Algorithms
    if (
      lowerMsg.includes('dsa') ||
      lowerMsg.includes('algorithm') ||
      lowerMsg.includes('data structure') ||
      lowerMsg.includes('array') ||
      lowerMsg.includes('linked list') ||
      lowerMsg.includes('tree') ||
      lowerMsg.includes('graph') ||
      lowerMsg.includes('dp') ||
      lowerMsg.includes('dynamic programming') ||
      lowerMsg.includes('complexity') ||
      lowerMsg.includes('sorting') ||
      lowerMsg.includes('binary search') ||
      lowerMsg.includes('two pointer') ||
      lowerMsg.includes('hashmap') ||
      lowerMsg.includes('lru')
    ) {
      return `Data Structures & Algorithms Breakdown for "${msg}":

1. Optimal Algorithmic Approach:
- Strategy: Choose between Hash Map (O(1) lookups), Two Pointers (sorted arrays), or Sliding Window (substrings/subarrays).
- Complexity Target: Aim for O(N) or O(N log N) Time Complexity and O(1) auxiliary Space Complexity.

2. Pattern Walkthrough:
- Identify if the input array is sorted (Binary Search / Two Pointers).
- Use a Hash Map to store complement values (target - current) for constant time checking.

3. Boundary Edge Cases:
- Empty or null inputs.
- Single-element arrays or duplicate elements.
- Integer overflow and scale constraints.`;
    }

    // 5. Tech Companies (Google, Meta, Amazon, Microsoft, Startups)
    if (
      lowerMsg.includes('google') ||
      lowerMsg.includes('amazon') ||
      lowerMsg.includes('meta') ||
      lowerMsg.includes('microsoft') ||
      lowerMsg.includes('apple') ||
      lowerMsg.includes('faang')
    ) {
      return `Target Company Interview Strategy for "${msg}":

1. Technical Coding Round:
- Focus on clean code, modular design, and explicit Big-O time & space complexity analysis.
- Communicate out loud before writing code.

2. System Design Round (Senior / Mid-Level):
- Discuss scale estimations, database trade-offs (SQL vs NoSQL), and single-point-of-failure redundancy.

3. Behavioral Round (Cultural Fit):
- Align responses with core principles (e.g. Ownership, Customer Obsession, Deep Dive).
- Use structured STAR format with measurable project metrics.`;
    }

    // 6. Generic High-Quality Fallback for any other Technical Question
    return `Technical Analysis & Guide for "${msg}":

1. Core Concept Overview:
- "${msg}" is a fundamental topic in modern software engineering and technical interviews.
- Focus on understanding underlying execution mechanics, architectural patterns, and real-world application.

2. Best Practices & Key Considerations:
- Structure: Keep code modular, predictable, and clean.
- Performance: Avoid redundant operations, optimize data structures, and handle memory allocation cleanly.
- Error Handling: Ensure robust boundary validation and informative error messaging.

3. Technical Interview Tip:
When explaining this topic in live technical interviews, start with a high-level 1-sentence definition, detail key technical components, and wrap up with a real-world project usage scenario.`;
  }

  if (mode === 'explainCode') {
    const codeSnippet = payload.code || '';
    const hasLoops = /for\s*\(|while\s*\(|\.map\(|\.forEach\(/.test(codeSnippet);
    const hasNestedLoops = /(for\s*\([\s\S]*for\s*\(|while\s*[\s\S]*while\s*\()/.test(codeSnippet);
    const hasMapSet = /new\s+(Map|Set|Array)\(|\[\]|\{\}/.test(codeSnippet);

    const timeComplexity = hasNestedLoops ? 'O(N^2)' : hasLoops ? 'O(N)' : 'O(1)';
    const spaceComplexity = hasMapSet ? 'O(N) auxiliary space' : 'O(1) auxiliary space';

    return `Code Complexity & Quality Analysis:

1. Time Complexity: ${timeComplexity}
- ${hasNestedLoops ? 'Nested loops detected causing quadratic execution time.' : hasLoops ? 'The algorithm iterates through input elements in a linear pass.' : 'Constant time operations detected.'}

2. Space Complexity: ${spaceComplexity}
- ${hasMapSet ? 'Additional data structures allocated proportionally to input size.' : 'Memory utilization remains constant regardless of input size.'}

3. Code Review & Edge Cases:
- Structure: Clear logical flow and clean variable scopes.
- Edge Case Check: Validate behavior for null/undefined inputs, empty arrays, or negative boundary constraints.
- Optimization Tip: Consider early returns at function entry point to skip unnecessary processing.`;
  }

  if (mode === 'hint') {
    const title = payload.problemTitle || 'Problem';
    return `Staged Technical Hints for "${title}":

Hint 1 (Intuition):
Break down the problem requirements and identify if sorting, two pointers, or a hash table can simplify nested loops.

Hint 2 (Data Structure):
Use an appropriate auxiliary data structure (Hash Map for O(1) lookups, Stack for nested structures, or Queue for level-order traversal).

Hint 3 (Algorithmic Strategy):
Handle boundary conditions first (null/empty inputs), then proceed with your primary iteration logic, maintaining optimal time complexity.`;
  }

  return `PrepBridge AI Assistant active and operational.`;
};

/**
 * Generic caller to Gemini model using @google/genai SDK with REST API fallback
 * Seamlessly iterates through CANDIDATE_MODELS if a model hits rate-limits (429), spikes (503), or 404.
 */
export const callGeminiAPI = async (promptText, systemInstruction = '', isJsonMode = false) => {
  const currentKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!currentKey || currentKey === 'your_gemini_api_key_here' || currentKey === 'mock_gemini_key') {
    return null;
  }

  // 1. Primary path: Use @google/genai SDK with client fallback
  if (aiClient) {
    for (const model of CANDIDATE_MODELS) {
      try {
        const config = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (isJsonMode) config.responseMimeType = 'application/json';

        const res = await aiClient.models.generateContent({
          model,
          contents: promptText,
          config
        });

        if (res && res.text) {
          const rawText = res.text;
          return isJsonMode ? rawText : cleanAIResponseText(rawText);
        }
      } catch (err) {
        // Log notice and try next candidate model in list
        // console.warn(`SDK model ${model} unavailable, trying next model...`);
      }
    }
  }

  // 2. Secondary fallback path: Direct REST API fetch
  const promptWithInstruction = systemInstruction
    ? `${systemInstruction}\n\nCandidate Question: ${promptText}`
    : promptText;

  for (const model of CANDIDATE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`;
      const payload = {
        contents: [{ parts: [{ text: promptWithInstruction }] }]
      };

      if (isJsonMode) {
        payload.generationConfig = { responseMimeType: 'application/json' };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload)
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const rawText = data.candidates[0].content.parts[0].text;
        return isJsonMode ? rawText : cleanAIResponseText(rawText);
      }
    } catch (err) {
      // Continue to next model on timeout or network error
    }
  }

  return null;
};

/**
 * Service: Interactive Technical Q&A Chat
 */
export const chatWithAI = async ({ message, history = [] }) => {
  const systemInstruction = `You are an Executive AI Technical Interviewer & Computer Science Lead.
CRITICAL PERSONA & RESPONSE RULES:
1. Directly and accurately answer the user's specific question FIRST with top priority.
2. If the user asks a math/arithmetic or simple logic question (e.g. "What is 100+100?"), state the direct answer immediately (e.g. "100 + 100 = 200") followed by a brief technical context if relevant.
3. If asked a technical/algorithm/system design question, answer directly with clear technical steps, formulas, and code snippets where appropriate.
4. Keep answers concise, highly technical, professional, elegant, and directly tailored for candidate interview preparation.
5. STRICT NO-SYMBOL RULE: Do NOT use markdown symbols like #, ##, ###, *, **, _, __, or > anywhere in your text. Present text in clean plain text. Code blocks using \`\`\` are allowed ONLY for code.`;

  const formattedPrompt = `User Query: ${message}`;
  const responseText = await callGeminiAPI(formattedPrompt, systemInstruction);

  if (responseText) {
    return cleanAIResponseText(responseText);
  }
  return generateFallbackResponse('chat', { message });
};

/**
 * Service: Code Explainer & Complexity Analyzer
 */
export const explainCode = async ({ code, language = 'javascript' }) => {
  const systemInstruction = `You are a Senior Code Reviewer & Complexity Analyzer. 
Analyze the candidate's code snippet carefully.
1. Bug & Correctness Detection: Check if the code has syntax errors, logical bugs, infinite loops, or failing edge cases. If it is WRONG or buggy, explicitly state "Bug Detected:" with the exact reason and failing input cases.
2. Time Complexity (e.g. O(N)).
3. Space Complexity (e.g. O(1)).
4. Fixed & Optimized Code: Provide the fully corrected, bug-free implementation in a code block.

CRITICAL FORMATTING & STYLE RULES:
- STRICT NO-SYMBOL RULE: Do NOT use markdown symbols like #, ##, ###, *, **, _, __, or > in text.
- Format code blocks using clean markdown code blocks (\`\`\`${language}).`;

  const prompt = `Language: ${language}\n\nCode Snippet:\n\`\`\`${language}\n${code}\n\`\`\``;
  const responseText = await callGeminiAPI(prompt, systemInstruction);

  if (responseText) {
    return cleanAIResponseText(responseText);
  }
  return generateFallbackResponse('explainCode', { code });
};

/**
 * Service: Staged DSA Hint Generator
 */
export const generateDSAHints = async ({ problemTitle, topic = 'General', code = '' }) => {
  const systemInstruction = `You are an AI Data Structures & Algorithms Tutor. 
Provide 3 progressive hints for solving the problem "${problemTitle}" (${topic}). 
CRITICAL FORMATTING & STYLE RULES:
1. Directly state Hint 1 (Intuition), Hint 2 (Data Structure & Strategy), and Hint 3 (Edge Cases & Key Details) in clean text.
2. STRICT NO-SYMBOL RULE: Do NOT use markdown symbols like #, ##, ###, *, **, _, __, or >.
3. Do NOT give away the complete code answer in Hint 1.`;

  const prompt = `Problem Title: ${problemTitle}\nTopic: ${topic}\nCurrent Student Code/Notes:\n${code || 'None'}`;
  const responseText = await callGeminiAPI(prompt, systemInstruction);

  if (responseText) {
    return cleanAIResponseText(responseText);
  }
  return generateFallbackResponse('hint', { problemTitle });
};

/**
 * Service: Generate realistic interview question for Mock Interview
 */
export const generateMockQuestion = async ({
  role = 'Full Stack Engineer',
  company = 'Google',
  interviewType = 'Coding & DSA',
  experienceLevel = 'Fresher / Entry Level (0-1 yrs)',
  questionNumber = 1,
  previousQA = []
}) => {
  const isFresher = (experienceLevel || '').toLowerCase().includes('fresher') || (experienceLevel || '').toLowerCase().includes('entry');

  const previousQuestionsText = previousQA.length > 0
    ? previousQA.map((q, i) => `Q${i + 1}: ${q.questionText}`).join('; ')
    : 'None';

  const systemInstruction = `You are a Senior Tech Interviewer at ${company} conducting a ${interviewType} interview for a ${role} position (${experienceLevel}).
Ask Question #${questionNumber} of 5.

CRITICAL RULES FOR QUESTION LENGTH & STYLE:
1. STRICT LENGTH LIMIT: Keep the question SHORT, realistic, and direct (maximum 1 to 2 short sentences, under 30 words).
2. Ask realistic, standard technical interview questions that real interviewers ask in actual live interviews at ${company}.
3. Do NOT repeat any of the previous questions: ${previousQuestionsText}.
4. Do NOT include answers or solutions in the question text.`;

  const contextText = `Ask Question #${questionNumber}.`;

  const responseText = await callGeminiAPI(contextText, systemInstruction);

  if (responseText) {
    return cleanAIResponseText(responseText);
  }

  // Practical Short & Realistic Fallback Questions (1-2 sentences max)
  if (isFresher || questionNumber === 1) {
    const fresherQuestions = [
      `Tell me about yourself and a technical project you built recently.`,
      interviewType === 'Behavioral'
        ? `Why do you want to start your software engineering career at ${company}?`
        : interviewType === 'System Design'
        ? `What is the difference between SQL and NoSQL databases? When would you use each?`
        : `Given an array of numbers, how do you find the second largest element in O(N) time?`,
      `What are the core principles of Object-Oriented Programming (OOP)?`,
      `How do you check whether a given string is a Palindrome?`,
      `Describe a challenging bug you encountered in a project and how you debugged it.`
    ];
    return fresherQuestions[(questionNumber - 1) % fresherQuestions.length];
  }

  // Fallback system design questions (Short & Realistic)
  if (interviewType === 'System Design') {
    const fallbackSystemDesign = [
      `How would you design a URL shortener service like TinyURL?`,
      `How would you design a Rate Limiter for an API gateway?`,
      `How would you design a real-time Chat application like WhatsApp?`,
      `What is the difference between horizontal and vertical database scaling?`,
      `How does a Content Delivery Network (CDN) reduce latency for static assets?`
    ];
    return fallbackSystemDesign[(questionNumber - 1) % fallbackSystemDesign.length];
  }

  if (interviewType === 'Behavioral') {
    const fallbackBehavioral = [
      `Tell me about a time you had a technical disagreement with a teammate and how you resolved it.`,
      `Describe a situation where you had to work under a tight deadline.`,
      `Tell me about a technical bug or mistake you made and what you learned from it.`,
      `How do you prioritize your work when handling multiple tasks simultaneously?`,
      `Describe a project where you took ownership from design to deployment.`
    ];
    return fallbackBehavioral[(questionNumber - 1) % fallbackBehavioral.length];
  }

  // Coding & DSA Short Fallbacks
  const fallbackCoding = [
    `Given an array of numbers and a target sum, how do you find two numbers that add up to the target?`,
    `How do you reverse a singly linked list in-place?`,
    `Explain how an LRU Cache works and which data structures you would use to achieve O(1) time.`,
    `What is the difference between Depth First Search (DFS) and Breadth First Search (BFS)?`,
    `How do you find the contiguous subarray with the largest sum using Kadane's Algorithm?`
  ];
  return fallbackCoding[(questionNumber - 1) % fallbackCoding.length];
};

/**
 * Helper to determine question category: 'BEHAVIORAL' | 'SYSTEM_DESIGN' | 'CODING_DSA' | 'GENERAL_TECH'
 */
export const detectQuestionCategory = (questionText = '', interviewType = '') => {
  const qLower = (questionText || '').toLowerCase();
  const typeLower = (interviewType || '').toLowerCase();

  // Keyword check in question text for Behavioral / Intro / Project questions
  const behavioralKeywords = [
    'tell me about yourself', 'introduce yourself', 'technical project', 'project you built',
    'project you worked', 'tell me about a project', 'tell me about a time', 'describe a time',
    'conflict', 'disagreement', 'deadline', 'challenge', 'failure', 'bug you encountered',
    'star method', 'why do you want', 'career', 'leadership', 'teamwork', 'stakeholder'
  ];

  if (behavioralKeywords.some(kw => qLower.includes(kw))) {
    return 'BEHAVIORAL';
  }

  const systemDesignKeywords = [
    'design', 'system design', 'architecture', 'scale', 'scaling', 'url shortener',
    'rate limiter', 'load balancer', 'cdn', 'cache', 'caching', 'sql vs nosql',
    'database scaling', 'microservices', 'api gateway', 'message queue', 'kafka',
    'throughput', 'latency', 'high availability', 'sharding', 'partitioning'
  ];

  if (systemDesignKeywords.some(kw => qLower.includes(kw))) {
    return 'SYSTEM_DESIGN';
  }

  const codingKeywords = [
    'array', 'string', 'linked list', 'tree', 'graph', 'hash map', 'two pointers',
    'binary search', 'recursion', 'dynamic programming', 'dp', 'sliding window',
    'palindrome', 'second largest', 'reverse', 'subarray', 'matrix', 'sorting',
    'time complexity', 'space complexity', 'big-o', 'kadane', 'in-place', 'algorithm'
  ];

  if (codingKeywords.some(kw => qLower.includes(kw))) {
    return 'CODING_DSA';
  }

  // Interview type fallbacks
  if (typeLower.includes('behavioral')) return 'BEHAVIORAL';
  if (typeLower.includes('system design')) return 'SYSTEM_DESIGN';
  if (typeLower.includes('coding') || typeLower.includes('dsa')) return 'CODING_DSA';

  return 'GENERAL_TECH';
};

/**
 * Service: Evaluate candidate's mock interview answer dynamically based on their specific reply
 */
export const evaluateMockAnswer = async ({
  questionText,
  candidateAnswer,
  role = 'Software Engineer',
  interviewType = 'Coding & DSA'
}) => {
  const category = detectQuestionCategory(questionText, interviewType);

  let categoryGuidance = '';
  if (category === 'BEHAVIORAL') {
    categoryGuidance = `
QUESTION CATEGORY: Behavioral / Personal Intro / Technical Project Discussion.
- Evaluate using the STAR framework (Situation, Task, Action, Result), candidate's personal role, technical choices, impact, and communication clarity.
- In 'improvements': Focus on missing STAR elements (e.g., quantifiable results, specific technical contributions, architectural choices, or lessons learned).
- In 'idealAnswer': Provide a structured 2-3 sentence ideal STAR response tailored to this behavioral/project question.`;
  } else if (category === 'SYSTEM_DESIGN') {
    categoryGuidance = `
QUESTION CATEGORY: System Design & Architecture.
- Evaluate high-level architecture, component breakdown (Load Balancer, API Gateway, DB choice, Caching), scalability, latency, and trade-offs.
- In 'improvements': Identify missing architectural components, throughput estimations, or trade-offs (e.g. SQL vs NoSQL, CAP theorem).
- In 'idealAnswer': Provide a concise 2-3 sentence system design blueprint for this system.`;
  } else if (category === 'CODING_DSA') {
    categoryGuidance = `
QUESTION CATEGORY: Coding & Data Structures / Algorithms.
- Evaluate algorithmic correctness, optimal data structure selection, Big-O Time & Space Complexity, and edge-case handling.
- In 'improvements': Highlight missing Big-O time/space analysis, missing boundary edge cases, or sub-optimal loop structures.
- In 'idealAnswer': State optimal data structure, time/space complexity, and edge-case handling in 2-3 concise sentences.`;
  } else {
    categoryGuidance = `
QUESTION CATEGORY: General Technical Concepts.
- Evaluate conceptual accuracy, core principles, practical engineering applications, and clarity.
- In 'improvements': Highlight missing core principles, real-world trade-offs, or practical code examples.
- In 'idealAnswer': Provide a clear 2-3 sentence technical explanation of the core concept.`;
  }

  const systemInstruction = `You are a Senior Technical Interviewer evaluating a candidate's answer for the position of ${role} (${interviewType}).
CRITICAL EVALUATION RULES:
1. Analyze the candidate's EXACT reply to the specific question asked: "${questionText}".
2. ${categoryGuidance}
3. DO NOT output generic or static placeholder text. Tailor all feedback directly to what the candidate actually wrote.
4. If candidate's answer is irrelevant or wrong for this specific question, score it low (1-3) and explain why in improvements.
5. In 'strengths': Quote or directly reference specific concepts, projects, technologies, or code logic that the candidate MENTIONED in their response.
6. In 'improvements': Give honest, constructive, and highly accurate feedback strictly relevant to THIS specific question and candidate answer.
7. Score: Assign an honest score from 1 to 10 based on accuracy, depth, and relevance to the question.

Output MUST be a valid JSON object matching this schema strictly:
{
  "score": 8,
  "strengths": "Specific strength referencing what candidate wrote...",
  "improvements": "Specific honest improvement tailored to this question category...",
  "idealAnswer": "Concise ideal response specifically for this question..."
}`;

  const prompt = `Question Asked: "${questionText}"\n\nCandidate's Actual Reply: "${candidateAnswer}"`;
  const responseText = await callGeminiAPI(prompt, systemInstruction, true);

  const sanitizeIdealAnswer = (rawText) => {
    if (!rawText) {
      if (category === 'BEHAVIORAL') {
        return `For "${questionText}", walk through your specific role, technical choices made, and quantifiable impact using the STAR framework.`;
      }
      if (category === 'SYSTEM_DESIGN') {
        return `For "${questionText}", outline high-level architecture components, data store selection, and scalability trade-offs.`;
      }
      return `For "${questionText}", state the core approach, walk through time & space complexity, and address edge cases cleanly.`;
    }
    return rawText
      .replace(/^an ideal response would follow the star framework and sound like this:?\s*/gi, '')
      .replace(/^an ideal response would (sound like this|highlight|cover|be):?\s*/gi, '')
      .replace(/^an ideal answer would (be|sound like this):?\s*/gi, '')
      .trim();
  };

  if (responseText) {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cleanedJson = jsonMatch[0].replace(/[\u0000-\u001F]+/g, ' ');
        const parsed = JSON.parse(cleanedJson);
        if (parsed && (parsed.strengths !== undefined || parsed.improvements !== undefined)) {
          const rawStrengths = Array.isArray(parsed.strengths) ? parsed.strengths.join('; ') : parsed.strengths;
          const rawImprovements = Array.isArray(parsed.improvements) ? parsed.improvements.join('; ') : parsed.improvements;
          const rawIdeal = Array.isArray(parsed.idealAnswer) ? parsed.idealAnswer.join(' ') : parsed.idealAnswer;

          return {
            score: Math.min(10, Math.max(1, parseInt(parsed.score) || 7)),
            strengths: cleanAIResponseText(rawStrengths) || `Answer submitted for evaluation.`,
            improvements: cleanAIResponseText(rawImprovements) || (category === 'BEHAVIORAL' ? `Structure your answer using STAR method and mention quantifiable results.` : `Be sure to explicitly analyze Time Complexity O(N) and handle boundary edge cases.`),
            idealAnswer: sanitizeIdealAnswer(cleanAIResponseText(rawIdeal))
          };
        }
      }
    } catch (e) {
      console.warn('JSON parsing notice for AI evaluation, activating dynamic candidate-aware fallback evaluator:', e.message);
    }
  }

  // Smart Dynamic Fallback Evaluator (Category-Aware)
  const trimmedAns = (candidateAnswer || '').trim();
  const words = trimmedAns ? trimmedAns.split(/\s+/) : [];
  const wordCount = words.length;
  const lowerAns = trimmedAns.toLowerCase();

  // Extract key technical/professional terms mentioned by candidate
  const techKeywords = [
    'hashmap', 'hash map', 'map', 'two pointer', 'two pointers', 'binary search', 'recursion',
    'dynamic programming', 'dp', 'memoization', 'bfs', 'dfs', 'stack', 'queue', 'heap',
    'tree', 'graph', 'sorting', 'array', 'linked list', 'sql', 'nosql', 'mongodb', 'postgresql',
    'react', 'node', 'express', 'javascript', 'typescript', 'python', 'java', 'useeffect', 'state',
    'redux', 'virtual dom', 'rest api', 'graphql', 'o(1)', 'o(n)', 'time complexity',
    'space complexity', 'edge case', 'null', 'boundary', 'star', 'situation', 'task', 'action',
    'result', 'impact', 'tradeoff', 'trade-off', 'scaling', 'cache', 'lru', 'load balancer',
    'architecture', 'microservices', 'aws', 'docker', 'frontend', 'backend', 'database'
  ];

  const foundTerms = techKeywords.filter(term => lowerAns.includes(term));
  const mentionsComplexity = lowerAns.includes('o(') || lowerAns.includes('complexity') || lowerAns.includes('time') || lowerAns.includes('space');
  const mentionsEdgeCases = lowerAns.includes('edge') || lowerAns.includes('null') || lowerAns.includes('empty') || lowerAns.includes('boundary') || lowerAns.includes('exception');
  const mentionsResults = lowerAns.includes('result') || lowerAns.includes('impact') || lowerAns.includes('improved') || lowerAns.includes('achieved') || lowerAns.includes('%') || lowerAns.includes('metrics') || lowerAns.includes('reduced') || lowerAns.includes('increased');
  const mentionsStar = lowerAns.includes('situation') || lowerAns.includes('action') || lowerAns.includes('role') || lowerAns.includes('built') || lowerAns.includes('developed');

  // Category-specific score calculation
  let calculatedScore = 5;
  if (wordCount > 40) calculatedScore += 2;
  else if (wordCount > 15) calculatedScore += 1;
  else calculatedScore -= 1;

  if (foundTerms.length > 0) calculatedScore += Math.min(3, foundTerms.length);

  if (category === 'BEHAVIORAL') {
    if (mentionsResults) calculatedScore += 1;
    if (mentionsStar) calculatedScore += 1;
  } else if (category === 'SYSTEM_DESIGN') {
    if (lowerAns.includes('scale') || lowerAns.includes('cache') || lowerAns.includes('db') || lowerAns.includes('database')) calculatedScore += 1;
    if (lowerAns.includes('tradeoff') || lowerAns.includes('trade-off') || lowerAns.includes('api')) calculatedScore += 1;
  } else if (category === 'CODING_DSA') {
    if (mentionsComplexity) calculatedScore += 1;
    if (mentionsEdgeCases) calculatedScore += 1;
  } else {
    if (wordCount > 30) calculatedScore += 1;
  }

  calculatedScore = Math.min(10, Math.max(2, calculatedScore));

  // Category-aware Strengths
  let dynamicStrengths = '';
  if (foundTerms.length > 0) {
    const formattedTerms = foundTerms.map(t => `"${t}"`).join(', ');
    dynamicStrengths = `Good technical communication! You explicitly referenced key terms (${formattedTerms}) in your explanation.`;
  } else if (wordCount > 25) {
    dynamicStrengths = `Clear structure! You provided a detailed response with ${wordCount} words addressing the question directly.`;
  } else if (wordCount > 0) {
    dynamicStrengths = `Direct answer provided. You identified the core response for "${questionText.slice(0, 55)}...".`;
  } else {
    dynamicStrengths = `Initial response recorded.`;
  }

  // Category-aware Improvements
  const improvementPoints = [];

  if (category === 'BEHAVIORAL') {
    if (!mentionsResults) {
      improvementPoints.push('Quantify your project impact or key results (e.g. percentage improvements, active users, or performance gains)');
    }
    if (!mentionsStar && wordCount < 35) {
      improvementPoints.push('Structure your answer using the STAR method: Situation, Task, Action, and Result');
    }
    if (wordCount < 25) {
      improvementPoints.push('Expand on your personal technical role, architecture choices, and how you handled key challenges');
    }
  } else if (category === 'SYSTEM_DESIGN') {
    if (!lowerAns.includes('scale') && !lowerAns.includes('capacity')) {
      improvementPoints.push('Mention scale bounds, estimation assumptions (QPS, throughput), and bottleneck mitigations');
    }
    if (!lowerAns.includes('cache') && !lowerAns.includes('db') && !lowerAns.includes('database')) {
      improvementPoints.push('Detail key components such as API Gateway, Caching strategy (Redis), and Database selection (SQL vs NoSQL)');
    }
    if (wordCount < 30) {
      improvementPoints.push('Walk through high-level data flow and trade-offs (e.g. latency vs consistency)');
    }
  } else if (category === 'CODING_DSA') {
    if (!mentionsComplexity) {
      improvementPoints.push('Explicitly state the Big-O Time Complexity (e.g., O(N)) and Space Complexity (e.g., O(1))');
    }
    if (!mentionsEdgeCases) {
      improvementPoints.push('Mention boundary edge cases such as null/empty inputs, duplicate values, or scale limits');
    }
    if (wordCount < 25) {
      improvementPoints.push('Expand your explanation with step-by-step algorithmic breakdown and code implementation details');
    }
  } else {
    if (wordCount < 25) {
      improvementPoints.push('Provide a more comprehensive technical breakdown with practical real-world code examples or usage scenarios');
    }
    if (!lowerAns.includes('why') && !lowerAns.includes('because') && !lowerAns.includes('example')) {
      improvementPoints.push('Explain underlying mechanisms and trade-offs compared to alternative approaches');
    }
  }

  const dynamicImprovements = improvementPoints.length > 0
    ? `To improve: ${improvementPoints.join('; ')}.`
    : category === 'BEHAVIORAL'
    ? `To achieve a top score, highlight a specific complex conflict or technical challenge you solved and its quantifiable business outcome.`
    : category === 'SYSTEM_DESIGN'
    ? `To achieve a top score, detail failure scenario recovery, monitoring, and database sharding trade-offs.`
    : category === 'CODING_DSA'
    ? `To achieve a top score, compare alternative data structure trade-offs and write clean, bug-free code.`
    : `To achieve a top score, detail internal execution mechanics and edge case behavior.`;

  // Category-aware Ideal Answer Blueprint
  let dynamicIdealAnswer = '';

  if (category === 'BEHAVIORAL') {
    if (questionText.toLowerCase().includes('tell me about yourself')) {
      dynamicIdealAnswer = `For "${questionText}": Briefly introduce your engineering background, highlight a key technical project by stating your tech stack & architecture, detail a major technical challenge you solved, and conclude with quantifiable results.`;
    } else {
      dynamicIdealAnswer = `For "${questionText}": Follow the STAR framework: Describe the Situation context, state your assigned Task, detail the technical Actions you personally executed, and highlight measurable Results & lessons learned.`;
    }
  } else if (category === 'SYSTEM_DESIGN') {
    dynamicIdealAnswer = `For "${questionText}": Define functional & scale requirements, present the high-level architecture (Load Balancer, API Gateway, DB, Cache), and outline key trade-offs (CAP theorem, caching invalidation).`;
  } else if (category === 'CODING_DSA') {
    dynamicIdealAnswer = `For "${questionText}": Clearly state your data structure choice (e.g. Hash Map or Two Pointers), state Time Complexity O(N) and Space Complexity O(1), and detail boundary edge-case validation.`;
  } else {
    dynamicIdealAnswer = `For "${questionText}": Provide a clear definition of the core concept, explain how it operates under the hood, compare with alternative approaches, and provide a concrete practical example.`;
  }

  return {
    score: calculatedScore,
    strengths: dynamicStrengths,
    improvements: dynamicImprovements,
    idealAnswer: dynamicIdealAnswer
  };
};

/**
 * Service: Generate final overall scorecard
 */
export const generateFinalMockScorecard = async ({ questions = [], role = 'Software Engineer', company = 'Google' }) => {
  const totalScoreSum = questions.reduce((sum, q) => sum + (q.score || 0), 0);
  const avgScore = questions.length > 0 ? Math.round((totalScoreSum / (questions.length * 10)) * 100) : 75;

  let overallSummary = `Completed 5-question ${company} Mock Technical Interview for ${role}. Average Candidate Rating: ${avgScore}%. Strong engineering intuition and clear communication demonstrated.`;

  if (avgScore >= 85) {
    overallSummary = `🏆 Strong Hire (85%+ Match)! Exceptional performance across technical accuracy, problem-solving, and communication tailored for ${company}'s engineering bar.`;
  } else if (avgScore >= 70) {
    overallSummary = `✅ Hire / Candidate Recommended (70%+ Match). Solid technical foundation demonstrated. Focus on refining edge case validation and STAR method metrics.`;
  } else {
    overallSummary = `📈 Candidate Needs Preparation (Under 70%). Revisit core technical topics, practice structured STAR method responses, and refine Big-O complexities.`;
  }

  return {
    overallScore: avgScore,
    overallSummary
  };
};
