document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addAgentBtn = document.getElementById('add-agent');
    const startAllBtn = document.getElementById('start-all');
    const stopAllBtn = document.getElementById('stop-all');
    const agentContainer = document.getElementById('agent-container');
    const agentForm = document.getElementById('agent-form');
    const newAgentForm = document.getElementById('new-agent-form');
    const cancelFormBtn = document.getElementById('cancel-form');
    
    // Agent data store
    let agents = [];
    let nextAgentId = 1;
    
    // Event Listeners
    addAgentBtn.addEventListener('click', showAgentForm);
    cancelFormBtn.addEventListener('click', hideAgentForm);
    newAgentForm.addEventListener('submit', createNewAgent);
    startAllBtn.addEventListener('click', startAllAgents);
    stopAllBtn.addEventListener('click', stopAllAgents);
    
    // Functions
    function showAgentForm() {
        agentForm.style.display = 'block';
    }
    
    function hideAgentForm() {
        agentForm.style.display = 'none';
        newAgentForm.reset();
    }
    
    function createNewAgent(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('agent-name');
        const typeSelect = document.getElementById('agent-type');
        const descriptionTextarea = document.getElementById('agent-description');
        
        const agent = {
            id: nextAgentId++,
            name: nameInput.value,
            type: typeSelect.value,
            description: descriptionTextarea.value,
            status: 'inactive',
            createdAt: new Date()
        };
        
        agents.push(agent);
        renderAgentCard(agent);
        hideAgentForm();
        newAgentForm.reset();
    }
    
    function renderAgentCard(agent) {
        const agentCard = document.createElement('div');
        agentCard.className = 'agent-card';
        agentCard.dataset.agentId = agent.id;
        
        agentCard.innerHTML = `
            <h3>${agent.name}</h3>
            <span class="agent-type">${agent.type}</span>
            <p>${agent.description || 'No description provided.'}</p>
            <div class="agent-status">
                <span class="status-indicator ${agent.status === 'active' ? 'status-active' : 'status-inactive'}"></span>
                <span>${agent.status === 'active' ? 'Running' : 'Stopped'}</span>
            </div>
            <div class="agent-controls">
                <button class="start-agent" ${agent.status === 'active' ? 'disabled' : ''}>Start</button>
                <button class="stop-agent" ${agent.status === 'inactive' ? 'disabled' : ''}>Stop</button>
                <button class="delete-agent">Delete</button>
            </div>
        `;
        
        // Add event listeners to the buttons
        const startBtn = agentCard.querySelector('.start-agent');
        const stopBtn = agentCard.querySelector('.stop-agent');
        const deleteBtn = agentCard.querySelector('.delete-agent');
        
        startBtn.addEventListener('click', () => startAgent(agent.id));
        stopBtn.addEventListener('click', () => stopAgent(agent.id));
        deleteBtn.addEventListener('click', () => deleteAgent(agent.id));
        
        agentContainer.appendChild(agentCard);
    }
    
    function startAgent(agentId) {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = 'active';
            updateAgentCard(agent);
            
            // Simulate agent activity with console logs
            console.log(`Agent ${agent.name} (${agent.type}) started`);
            simulateAgentActivity(agent);
        }
    }
    
    function stopAgent(agentId) {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = 'inactive';
            updateAgentCard(agent);
            console.log(`Agent ${agent.name} (${agent.type}) stopped`);
        }
    }
    
    function deleteAgent(agentId) {
        const agentIndex = agents.findIndex(a => a.id === agentId);
        if (agentIndex !== -1) {
            const agent = agents[agentIndex];
            agents.splice(agentIndex, 1);
            
            const agentCard = document.querySelector(`.agent-card[data-agent-id="${agentId}"]`);
            if (agentCard) {
                agentCard.remove();
            }
            
            console.log(`Agent ${agent.name} (${agent.type}) deleted`);
        }
    }
    
    function updateAgentCard(agent) {
        const agentCard = document.querySelector(`.agent-card[data-agent-id="${agent.id}"]`);
        if (agentCard) {
            const statusIndicator = agentCard.querySelector('.status-indicator');
            const statusText = agentCard.querySelector('.agent-status span:last-child');
            const startBtn = agentCard.querySelector('.start-agent');
            const stopBtn = agentCard.querySelector('.stop-agent');
            
            statusIndicator.className = `status-indicator ${agent.status === 'active' ? 'status-active' : 'status-inactive'}`;
            statusText.textContent = agent.status === 'active' ? 'Running' : 'Stopped';
            
            startBtn.disabled = agent.status === 'active';
            stopBtn.disabled = agent.status === 'inactive';
        }
    }
    
    function startAllAgents() {
        agents.forEach(agent => {
            if (agent.status === 'inactive') {
                startAgent(agent.id);
            }
        });
    }
    
    function stopAllAgents() {
        agents.forEach(agent => {
            if (agent.status === 'active') {
                stopAgent(agent.id);
            }
        });
    }
    
    function simulateAgentActivity(agent) {
        if (agent.status === 'active') {
            // Different messages based on agent type
            const messages = {
                assistant: [
                    "Processing user query...",
                    "Generating response...",
                    "Analyzing context...",
                    "Retrieving information..."
                ],
                researcher: [
                    "Searching databases...",
                    "Analyzing research papers...",
                    "Compiling findings...",
                    "Cross-referencing sources..."
                ],
                coder: [
                    "Writing code...",
                    "Debugging issue...",
                    "Optimizing algorithm...",
                    "Refactoring module..."
                ],
                custom: [
                    "Executing custom task...",
                    "Processing data...",
                    "Performing operation...",
                    "Task in progress..."
                ]
            };
            
            const agentMessages = messages[agent.type] || messages.custom;
            const randomMessage = agentMessages[Math.floor(Math.random() * agentMessages.length)];
            
            console.log(`[${agent.name}]: ${randomMessage}`);
            
            // Continue simulation if agent is still active
            setTimeout(() => {
                const currentAgent = agents.find(a => a.id === agent.id);
                if (currentAgent && currentAgent.status === 'active') {
                    simulateAgentActivity(currentAgent);
                }
            }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
        }
    }
    
    // Add some sample agents for demonstration
    function addSampleAgents() {
        const sampleAgents = [
            {
                name: "Assistant Bot",
                type: "assistant",
                description: "General purpose assistant that can answer questions and provide information."
            },
            {
                name: "Research Agent",
                type: "researcher",
                description: "Specialized in gathering and analyzing information from various sources."
            },
            {
                name: "Code Helper",
                type: "coder",
                description: "Helps with writing, debugging, and optimizing code."
            }
        ];
        
        sampleAgents.forEach(sample => {
            const agent = {
                id: nextAgentId++,
                name: sample.name,
                type: sample.type,
                description: sample.description,
                status: 'inactive',
                createdAt: new Date()
            };
            
            agents.push(agent);
            renderAgentCard(agent);
        });
    }
    
    // Initialize with sample agents
    addSampleAgents();
});