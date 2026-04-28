import { getSessionId } from "./sessionUtils.js";

const sessionId = getSessionId();

document.getElementById('result').innerHTML = "";

async function sendPrompt(){
    const input = document.getElementById('prompt').value;
    const tool = document.getElementById('tool').value;
    const provider = document.getElementById('provider').value;
    const file = document.getElementById('fileInput').files[0];

    const formData = new FormData();

    formData.append("prompt", input);
    formData.append("tool", tool);
    formData.append("provider", provider);
    formData.append("sessionId", sessionId);

    if(file){
        formData.append("file", file);
    }

    // const res = await fetch("/generate", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({prompt : input, tool: tool, provider: provider, sessionId : sessionId})
    // });

    const res = await fetch("/generate", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if(!data.success){
        document.getElementById('result').innerHTML = "Error : "+ data.text_error;
    } else {
        document.getElementById('result').innerHTML = data.text_output;
    }
}

async function seeHistory(){
    const historyBox = document.getElementById('result');

    const res = await fetch(`/history/${sessionId}`);
    const data = await res.json();

    if(!data.success){
        document.getElementById('result').innerHTML = data.text_error;
    } else {
        historyBox.innerHTML = "";

        data.history.forEach(msg => {
            historyBox.innerHTML += `
                <div class="message ${msg.role}">
                    <div class="role">${msg.role.toUpperCase()}</div>
                    <div class="text">${msg.text}</div>
                </div>
            `;
        });
    }
}

async function clearHistory(){
    const res = await fetch(`/history/${sessionId}`, {
        method : "DELETE"
    });

    const data = await res.json();
    
    if (!data.success) {
        document.getElementById("result").innerHTML = "Failed to clear history.";
    } else {
        document.getElementById("result").innerHTML = "History cleared.";
    }
}


document.getElementById("generateBtn")
    .addEventListener("click", sendPrompt);

document.getElementById("historyBtn")
    .addEventListener("click", seeHistory);

document.getElementById("clearBtn")
    .addEventListener("click", clearHistory);