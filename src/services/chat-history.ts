type messages = {
    role : "user" | "ai";
    text : string
}

const sessionHistory: Record<string, messages[]> = {};

export function addToHistory(sessionId: string, userInput: string, aiOutput: string, ){
    if(!sessionHistory[sessionId]){
        sessionHistory[sessionId] = [];
    }

    sessionHistory[sessionId].push(
        {role : "user", text : userInput},
        {role : "ai", text : aiOutput}
    ); 

}

export function getHistory(sessionId: string) {
    return sessionHistory[sessionId] || [];
}

export function clearHistory(sessionId: string) {
    delete sessionHistory[sessionId];
}