// Agent class to represent an AI agent
class Agent {
    constructor(id, name, type, description) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.active = false;
        this.createdAt = new Date();
    }

    toggleActive() {
        this.active = !this.active;
        return this.active;
    }
}

// AgentFarm class to manage all agents
class AgentFarm {
    constructor() {
        this.agents = [];
        this.nextId = 1;
        this.init();
    }

    init() {
        // DOM elements
        this.agentContainer = document.getElementById('agent-container');
        this.addAgentBtn = document.getElementById('add-agent');
        this.startAllBtn = document.getElementById('start-all');
        this.stopAllBtn = document.getElementById('stop-all');
        this.agentForm = document.getElementById('agent-form');
        this.newAgentForm = document.getElementById('new-agent-form');
        this.cancelFormBtn = document.getElementById('cancel-form');

        // Event listeners
        this.addAgentBtn.addEventListener('click', () => this.showAgentForm());
        this.cancelFormBtn.addEventListener('click', () => this.hideAgentForm());
        this.newAgentForm.addEventListener('submit', (e) => this.createAgent(e));
        this.startAllBtn.addEventListener('click', () => this.startAllAgents());
        this.stopAllBtn.addEventListener('click', () => this.stopAllAgents());

        // Load sample agents
        this.loadSampleAgents();
        this.renderAgents();
    }

    loadSampleAgents() {
        const sampleAgents = [
            new Agent(this.nextId++, 'Assistant Bot', 'assistant', 'General purpose assistant for answering questions'),
            new Agent(this.nextId++, 'Research Agent', 'researcher', 'Specialized in gathering and analyzing information'),
            new Agent(this.nextId++, 'Data Analyzer', 'analyzer', 'Processes and visualizes complex data sets')
        ];
        
        this.agents = sampleAgents;
    }

    showAgentForm() {
        this.agentForm.classList.add('active');
    }

    hideAgentForm() {
        this.agentForm.classList.remove('active');
        this.newAgentForm.reset();
    }

    createAgent(e) {
        e.preventDefault();
        
        const name = document.getElementById('agent-name').value;
        const type = document.getElementById('agent-type').value;
        const description = document.getElementById('agent-description').value;
        
        const newAgent = new Agent(this.nextId++, name, type, description);
        this.agents.push(newAgent);
        
        this.renderAgents();
        this.hideAgentForm();
    }

    renderAgents() {
        this.agentContainer.innerHTML = '';
        
        if (this.agents.length === 0) {
            this.agentContainer.innerHTML = '<p>No agents available. Create your first agent!</p>';
            return;
        }
        
        this.agents.forEach(agent => {
            const agentCard = document.createElement('div');
            agentCard.className = 'agent-card';
            agentCard.innerHTML = `
                <div class="agent-status ${agent.active ? 'status-active' : 'status-inactive'}"></div>
                <h3>${agent.name}</h3>
                <span class="agent-type">${agent.type}</span>
                <p>${agent.description}</p>
                <div class="agent-actions">
                    <button class="toggle-btn">${agent.active ? 'Stop' : 'Start'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            
            // Add event listeners to the buttons
            const toggleBtn = agentCard.querySelector('.toggle-btn');
            toggleBtn.addEventListener('click', () => this.toggleAgentStatus(agent.id, toggleBtn, agentCard));
            
            const deleteBtn = agentCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteAgent(agent.id));
            
            this.agentContainer.appendChild(agentCard);
        });
    }

    toggleAgentStatus(agentId, button, card) {
        const agent = this.agents.find(a => a.id === agentId);
        if (agent) {
            const isActive = agent.toggleActive();
            button.textContent = isActive ? 'Stop' : 'Start';
            
            const statusIndicator = card.querySelector('.agent-status');
            statusIndicator.className = `agent-status ${isActive ? 'status-active' : 'status-inactive'}`;
        }
    }

    deleteAgent(agentId) {
        this.agents = this.agents.filter(agent => agent.id !== agentId);
        this.renderAgents();
    }

    startAllAgents() {
        this.agents.forEach(agent => {
            agent.active = true;
        });
        this.renderAgents();
    }

    stopAllAgents() {
        this.agents.forEach(agent => {
            agent.active = false;
        });
        this.renderAgents();
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const agentFarm = new AgentFarm();
});