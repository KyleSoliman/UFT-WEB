// Enhanced Palace Interaction System
class PalaceInteractionSystem {
    constructor() {
        this.gameState = {
            currentLocation: 'entrance',
            securityLevel: 25,
            stealthActive: false,
            itemsUsed: 0,
            dialogueHistory: [],
            characterRelationships: {
                joker: { trust: 100, hp: 100, sp: 80 },
                ryuji: { trust: 85, hp: 85, sp: 60 },
                ann: { trust: 92, hp: 92, sp: 75 },
                morgana: { trust: 78, hp: 78, sp: 90 }
            },
            inventory: {
                medicine: 3,
                lockpick: 2,
                smokeBomb: 1,
                gohoM: 1,
                key: 0
            },
            discoveries: [],
            timeSpent: 0
        };
        
        this.dialogues = {
            joker: [
                "Let's stay focused. We need to find that treasure.",
                "Everyone stay close. This place gives me the creeps.",
                "I can sense a strong distortion ahead.",
                "We should be careful not to trigger any alarms."
            ],
            ryuji: [
                "Man, this place is way too fancy for my taste!",
                "Hey, let's just smash through everything!",
                "Ugh, all this sneaking around is making me tired.",
                "For real?! How much further do we gotta go?"
            ],
            ann: [
                "This palace feels so oppressive... that poor ruler.",
                "We need to be more careful with our approach.",
                "I can hear shadows moving nearby. Everyone be quiet.",
                "Let's show them what the Phantom Thieves can do!"
            ],
            morgana: [
                "Remember, we're here to change their heart, not for revenge.",
                "I can smell treasure from here... we're getting close!",
                "Stay sharp! My whiskers are telling me danger is near.",
                "This cognitive world is more twisted than I expected."
            ]
        };
        
        this.interactiveObjects = {
            paintings: {
                name: "Ornate Painting",
                description: "A disturbing portrait that seems to watch your every move.",
                interactions: ["examine", "touch", "ignore"],
                discovered: false
            },
            statue: {
                name: "Golden Statue",
                description: "A gaudy statue representing the palace ruler's ego.",
                interactions: ["examine", "climb", "break"],
                discovered: false
            },
            door: {
                name: "Locked Door",
                description: "An ornate door with an intricate lock mechanism.",
                interactions: ["examine", "pick_lock", "force"],
                discovered: false,
                locked: true
            },
            chest: {
                name: "Treasure Chest",
                description: "A mysterious chest that might contain valuable items.",
                interactions: ["examine", "open", "trap_check"],
                discovered: false,
                opened: false
            },
            ventilation: {
                name: "Air Vent",
                description: "A large ventilation grate that could provide an alternate route.",
                interactions: ["examine", "enter", "listen"],
                discovered: false
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindCharacterInteractions();
        this.bindObjectInteractions();
        this.bindAdvancedActions();
        this.startAmbientSounds();
        this.initializeDialogueSystem();
    }
    
    bindCharacterInteractions() {
        document.querySelectorAll('.team-member').forEach((member, index) => {
            const characters = ['joker', 'ryuji', 'ann', 'morgana'];
            const charName = characters[index];
            
            // Right-click for dialogue
            member.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.startDialogue(charName);
            });
            
            // Double-click for character actions
            member.addEventListener('dblclick', () => {
                this.performCharacterAction(charName);
            });
            
            // Hover for status tooltips
            member.addEventListener('mouseenter', () => {
                this.showCharacterTooltip(charName, member);
            });
            
            member.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }
    
    bindObjectInteractions() {
        // Create interactive objects in the palace
        this.createInteractiveObjects();
        
        // Bind click events for all interactive objects
        document.querySelectorAll('.interactive-object').forEach(obj => {
            obj.addEventListener('click', (e) => {
                const objectType = obj.dataset.objectType;
                this.interactWithObject(objectType);
            });
            
            obj.addEventListener('mouseenter', () => {
                obj.style.filter = 'brightness(1.3)';
                this.showObjectTooltip(obj);
            });
            
            obj.addEventListener('mouseleave', () => {
                obj.style.filter = 'brightness(1)';
                this.hideTooltip();
            });
        });
    }
    
    createInteractiveObjects() {
        const mapDisplay = document.querySelector('.map-display');
        
        // Create painting
        const painting = document.createElement('div');
        painting.className = 'interactive-object painting';
        painting.dataset.objectType = 'paintings';
        painting.style.cssText = `
            position: absolute;
            top: 15%;
            left: 10%;
            width: 40px;
            height: 30px;
            background: linear-gradient(45deg, #8B4513, #DAA520);
            border: 2px solid #FFD700;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        painting.innerHTML = '🖼️';
        painting.title = 'Mysterious Painting';
        
        // Create statue
        const statue = document.createElement('div');
        statue.className = 'interactive-object statue';
        statue.dataset.objectType = 'statue';
        statue.style.cssText = `
            position: absolute;
            top: 25%;
            left: 85%;
            width: 35px;
            height: 35px;
            background: radial-gradient(circle, #FFD700, #DAA520);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        statue.innerHTML = '🏛️';
        statue.title = 'Golden Statue';
        
        // Create locked door
        const door = document.createElement('div');
        door.className = 'interactive-object door';
        door.dataset.objectType = 'door';
        door.style.cssText = `
            position: absolute;
            top: 50%;
            left: 5%;
            width: 25px;
            height: 40px;
            background: linear-gradient(180deg, #8B4513, #654321);
            border: 2px solid #DAA520;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        door.innerHTML = '🚪';
        door.title = 'Locked Door';
        
        // Create treasure chest
        const chest = document.createElement('div');
        chest.className = 'interactive-object chest';
        chest.dataset.objectType = 'chest';
        chest.style.cssText = `
            position: absolute;
            top: 70%;
            left: 75%;
            width: 30px;
            height: 25px;
            background: linear-gradient(45deg, #8B4513, #DAA520);
            border: 2px solid #FFD700;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        chest.innerHTML = '📦';
        chest.title = 'Treasure Chest';
        
        // Create ventilation
        const vent = document.createElement('div');
        vent.className = 'interactive-object ventilation';
        vent.dataset.objectType = 'ventilation';
        vent.style.cssText = `
            position: absolute;
            top: 5%;
            left: 50%;
            width: 35px;
            height: 20px;
            background: linear-gradient(90deg, #333, #666);
            border: 2px solid #888;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        vent.innerHTML = '🌬️';
        vent.title = 'Air Ventilation';
        
        // Add all objects to map
        mapDisplay.appendChild(painting);
        mapDisplay.appendChild(statue);
        mapDisplay.appendChild(door);
        mapDisplay.appendChild(chest);
        mapDisplay.appendChild(vent);
    }
    
    bindAdvancedActions() {
        // Enhanced stealth system
        const stealthBtn = document.querySelector('.action-btn:nth-child(4)');
        stealthBtn.addEventListener('click', () => {
            this.toggleStealth();
        });
        
        // Time-based events
        setInterval(() => {
            this.gameState.timeSpent++;
            this.randomEvents();
        }, 30000); // Every 30 seconds
        
        // Advanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'q':
                        e.preventDefault();
                        this.quickSave();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.showInventoryDetail();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.showDetailedMap();
                        break;
                }
            }
        });
    }
    
    startDialogue(character) {
        const dialogues = this.dialogues[character];
        const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        
        this.gameState.dialogueHistory.push({
            character: character,
            dialogue: randomDialogue,
            timestamp: Date.now()
        });
        
        this.showDialogueModal(character, randomDialogue);
        this.updateCharacterRelationship(character, 2);
    }
    
    showDialogueModal(character, dialogue) {
        const characterNames = {
            joker: 'Joker',
            ryuji: 'Ryuji (Skull)',
            ann: 'Ann (Panther)', 
            morgana: 'Morgana (Mona)'
        };
        
        const modal = document.createElement('div');
        modal.className = 'dialogue-modal';
        modal.innerHTML = `
            <div class="dialogue-content">
                <div class="character-portrait ${character}"></div>
                <div class="dialogue-text">
                    <h3>${characterNames[character]}</h3>
                    <p>"${dialogue}"</p>
                    <div class="dialogue-options">
                        <button onclick="this.closest('.dialogue-modal').remove()">Continue</button>
                        <button onclick="palace.respondToCharacter('${character}')">Respond</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }
    
    respondToCharacter(character) {
        const responses = {
            joker: "I understand. Let's stay focused on our mission.",
            ryuji: "Take it easy, Ryuji. We need to be smart about this.",
            ann: "You're right, Ann. We'll be careful.",
            morgana: "Thanks for the advice, Morgana. Your experience helps."
        };
        
        this.updateCharacterRelationship(character, 5);
        this.showModal("Response", `You: "${responses[character]}"`);
        
        // Remove dialogue modal
        const dialogueModal = document.querySelector('.dialogue-modal');
        if (dialogueModal) {
            dialogueModal.remove();
        }
    }
    
    performCharacterAction(character) {
        const actions = {
            joker: () => {
                this.showModal("Joker's Action", "Joker uses Third Eye to reveal hidden paths and secrets!");
                this.revealHiddenObjects();
            },
            ryuji: () => {
                this.showModal("Ryuji's Action", "Ryuji charges forward, breaking through obstacles!");
                this.breakObstacle();
            },
            ann: () => {
                this.showModal("Ann's Action", "Ann uses her charm to distract nearby shadows!");
                this.distractShadows();
            },
            morgana: () => {
                this.showModal("Morgana's Action", "Morgana provides tactical analysis of the area!");
                this.analyzeSurroundings();
            }
        };
        
        actions[character]();
        this.updateCharacterRelationship(character, 3);
    }
    
    interactWithObject(objectType) {
        const obj = this.interactiveObjects[objectType];
        if (!obj) return;
        
        if (!obj.discovered) {
            obj.discovered = true;
            this.gameState.discoveries.push(objectType);
            this.showModal("Discovery!", `You discovered: ${obj.name}`);
        }
        
        this.showObjectInteractionMenu(objectType);
    }
    
    showObjectInteractionMenu(objectType) {
        const obj = this.interactiveObjects[objectType];
        const modal = document.createElement('div');
        modal.className = 'interaction-modal';
        
        const actionsHtml = obj.interactions.map(action => 
            `<button class="interaction-btn" onclick="palace.performObjectAction('${objectType}', '${action}')">${this.formatActionName(action)}</button>`
        ).join('');
        
        modal.innerHTML = `
            <div class="interaction-content">
                <h3>${obj.name}</h3>
                <p>${obj.description}</p>
                <div class="interaction-actions">
                    ${actionsHtml}
                    <button class="interaction-btn cancel" onclick="this.closest('.interaction-modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        document.body.appendChild(modal);
    }
    
    performObjectAction(objectType, action) {
        const obj = this.interactiveObjects[objectType];
        let result = "";
        
        switch(objectType) {
            case 'paintings':
                result = this.handlePaintingAction(action);
                break;
            case 'statue':
                result = this.handleStatueAction(action);
                break;
            case 'door':
                result = this.handleDoorAction(action);
                break;
            case 'chest':
                result = this.handleChestAction(action);
                break;
            case 'ventilation':
                result = this.handleVentAction(action);
                break;
        }
        
        this.showModal(`${obj.name} - ${this.formatActionName(action)}`, result);
        this.closeInteractionModal();
    }
    
    handlePaintingAction(action) {
        switch(action) {
            case 'examine':
                return "The painting depicts the palace ruler in a grandiose pose. The eyes seem to follow you, and you feel a chill down your spine.";
            case 'touch':
                this.increaseSecurityLevel(5);
                return "As you touch the painting, it feels warm. Suddenly, an alarm sounds! Security level increased!";
            case 'ignore':
                return "You decide to ignore the unsettling painting and move on. Sometimes ignorance is bliss.";
        }
    }
    
    handleStatueAction(action) {
        switch(action) {
            case 'examine':
                return "A golden statue representing the ruler's inflated ego. It's surprisingly heavy and well-crafted.";
            case 'climb':
                return "You climb the statue and get a better view of the area. You spot a hidden passage behind some curtains!";
            case 'break':
                this.increaseSecurityLevel(15);
                return "You damage the statue! The crash echoes through the palace. Security is now on high alert!";
        }
    }
    
    handleDoorAction(action) {
        switch(action) {
            case 'examine':
                return "An ornate door with a complex lock. You'll need lockpicking skills or a key to open it.";
            case 'pick_lock':
                if (this.gameState.inventory.lockpick > 0) {
                    this.gameState.inventory.lockpick--;
                    this.interactiveObjects.door.locked = false;
                    return "Successfully picked the lock! The door creaks open, revealing a treasure room beyond.";
                } else {
                    return "You don't have any lockpicks! You'll need to find another way.";
                }
            case 'force':
                this.increaseSecurityLevel(20);
                return "You force the door open with a loud crash! The noise attracts unwanted attention.";
        }
    }
    
    handleChestAction(action) {
        switch(action) {
            case 'examine':
                return "A mysterious chest with intricate carvings. It could contain valuable items... or traps.";
            case 'open':
                if (!this.interactiveObjects.chest.opened) {
                    this.interactiveObjects.chest.opened = true;
                    this.gameState.inventory.medicine += 2;
                    this.gameState.inventory.key += 1;
                    return "The chest opens with a satisfying click! You found 2 Medicines and a Silver Key!";
                } else {
                    return "The chest is empty. You've already taken everything.";
                }
            case 'trap_check':
                return "You carefully examine the chest for traps. It appears to be safe, but you notice a hidden mechanism.";
        }
    }
    
    handleVentAction(action) {
        switch(action) {
            case 'examine':
                return "A large ventilation grate. You can hear air flowing through it. It might lead somewhere interesting.";
            case 'enter':
                this.gameState.currentLocation = 'ventilation_system';
                return "You crawl through the ventilation system. You emerge in a different part of the palace, avoiding security!";
            case 'listen':
                return "You listen carefully. You can hear shadows patrolling below and the ruler's voice echoing from deeper in the palace.";
        }
    }
    
    // Helper methods
    formatActionName(action) {
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    closeInteractionModal() {
        const modal = document.querySelector('.interaction-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    updateCharacterRelationship(character, amount) {
        if (this.gameState.characterRelationships[character]) {
            this.gameState.characterRelationships[character].trust += amount;
            this.updateCharacterDisplay(character);
        }
    }
    
    updateCharacterDisplay(character) {
        const characters = ['joker', 'ryuji', 'ann', 'morgana'];
        const index = characters.indexOf(character);
        const memberElement = document.querySelectorAll('.team-member')[index];
        
        if (memberElement) {
            const trustLevel = this.gameState.characterRelationships[character].trust;
            if (trustLevel > 100) {
                memberElement.style.border = '2px solid #00ff00';
                memberElement.title = `${character.toUpperCase()} - Trust Level: MAX`;
            }
        }
    }
    
    increaseSecurityLevel(amount) {
        this.gameState.securityLevel = Math.min(this.gameState.securityLevel + amount, 100);
        const securityElement = document.querySelector('.security-level');
        securityElement.textContent = this.gameState.securityLevel + '%';
        
        if (this.gameState.securityLevel >= 75) {
            securityElement.style.color = '#ff0000';
            this.showModal("High Alert!", "Security is now on high alert! Shadows are actively searching!");
        } else if (this.gameState.securityLevel >= 50) {
            securityElement.style.color = '#ffaa00';
        }
    }
    
    toggleStealth() {
        this.gameState.stealthActive = !this.gameState.stealthActive;
        const stealthBtn = document.querySelector('.action-btn:nth-child(4)');
        
        if (this.gameState.stealthActive) {
            stealthBtn.style.background = 'linear-gradient(135deg, #00ff00, #008800)';
            stealthBtn.textContent = 'Stealth: ON';
            document.body.style.filter = 'brightness(0.7) contrast(1.2)';
        } else {
            stealthBtn.style.background = '';
            stealthBtn.textContent = 'Stealth Mode';
            document.body.style.filter = '';
        }
    }
    
    revealHiddenObjects() {
        document.querySelectorAll('.interactive-object').forEach(obj => {
            obj.style.boxShadow = '0 0 15px #00ff00';
            setTimeout(() => {
                obj.style.boxShadow = '';
            }, 3000);
        });
    }
    
    breakObstacle() {
        this.increaseSecurityLevel(10);
        this.showModal("Obstacle Destroyed", "Ryuji's brute force clears the path, but makes some noise!");
    }
    
    distractShadows() {
        if (this.gameState.securityLevel > 10) {
            this.gameState.securityLevel -= 10;
            const securityElement = document.querySelector('.security-level');
            securityElement.textContent = this.gameState.securityLevel + '%';
        }
    }
    
    analyzeSurroundings() {
        const analysis = [
            "Morgana detects three shadows patrolling the eastern corridor.",
            "There's a hidden switch behind the bookshelf on the north wall.",
            "The ruler's presence is strongest in the tower above.",
            "Morgana senses a safe room two floors down."
        ];
        
        const randomAnalysis = analysis[Math.floor(Math.random() * analysis.length)];
        this.showModal("Tactical Analysis", randomAnalysis);
    }
    
    randomEvents() {
        if (Math.random() < 0.3) { // 30% chance
            const events = [
                "You hear footsteps echoing in the distance...",
                "A shadow passes by the window.",
                "The palace structure shifts slightly.",
                "You sense the ruler's emotions growing stronger.",
                "A door creaks open somewhere nearby."
            ];
            
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            this.showModal("Palace Event", randomEvent);
        }
    }
    
    showModal(title, text) {
        const existingModal = document.getElementById('modalOverlay');
        if (existingModal.style.display === 'flex') {
            // Queue the modal if one is already showing
            setTimeout(() => this.showModal(title, text), 2000);
            return;
        }
        
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalText').textContent = text;
        existingModal.style.display = 'flex';
    }
    
    quickSave() {
        localStorage.setItem('palaceGameState', JSON.stringify(this.gameState));
        this.showModal("Game Saved", "Your progress has been saved!");
    }
    
    showInventoryDetail() {
        const inventoryText = Object.entries(this.gameState.inventory)
            .map(([item, count]) => `${item}: ${count}`)
            .join('\n');
        this.showModal("Detailed Inventory", inventoryText);
    }
    
    showDetailedMap() {
        this.showModal("Palace Map", `Current Location: ${this.gameState.currentLocation}\nDiscoveries: ${this.gameState.discoveries.length}\nTime Spent: ${this.gameState.timeSpent} minutes`);
    }
    
    initializeDialogueSystem() {
        // Add CSS for dialogue system
        const dialogueCSS = document.createElement('style');
        dialogueCSS.textContent = `
            .dialogue-content {
                background: linear-gradient(135deg, rgba(26,0,0,0.95), rgba(0,0,0,0.95));
                border: 3px solid #ff0000;
                border-radius: 15px;
                padding: 2rem;
                display: flex;
                gap: 1.5rem;
                max-width: 600px;
                animation: slideInFromLeft 0.5s ease;
            }
            
            .character-portrait {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-size: cover;
                border: 3px solid #ff0000;
            }
            
            .character-portrait.joker { background: linear-gradient(45deg, #000, #333); }
            .character-portrait.ryuji { background: linear-gradient(45deg, #ffff00, #ff8800); }
            .character-portrait.ann { background: linear-gradient(45deg, #ff69b4, #ff1493); }
            .character-portrait.morgana { background: linear-gradient(45deg, #4169e1, #0000cd); }
            
            .dialogue-text h3 {
                color: #ff0000;
                margin-bottom: 1rem;
                font-family: 'Oswald', sans-serif;
            }
            
            .dialogue-options {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .dialogue-options button {
                padding: 0.5rem 1rem;
                background: #ff0000;
                border: none;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Oswald', sans-serif;
            }
            
            .interaction-content {
                background: linear-gradient(135deg, rgba(26,0,0,0.95), rgba(0,0,0,0.95));
                border: 3px solid #ff0000;
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                max-width: 500px;
            }
            
            .interaction-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-top: 1.5rem;
                justify-content: center;
            }
            
            .interaction-btn {
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, #ff0000, #cc0000);
                border: none;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Oswald', sans-serif;
                font-weight: 600;
                text-transform: uppercase;
                transition: all 0.3s ease;
            }
            
            .interaction-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255,0,0,0.4);
            }
            
            .interaction-btn.cancel {
                background: linear-gradient(135deg, #666, #333);
            }
            
            @keyframes slideInFromLeft {
                from { transform: translateX(-100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(dialogueCSS);
    }
    
    startAmbientSounds() {
        // Simulate ambient palace sounds
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                const cursor = document.querySelector('.cursor');
                cursor.style.boxShadow = '0 0 20px rgba(255,0,0,0.8)';
                setTimeout(() => {
                    cursor.style.boxShadow = '';
                }, 500);
            }
        }, 5000);
    }
}

// Initialize the enhanced palace system
const palace = new PalaceInteractionSystem();

// Make it globally accessible for HTML onclick events
window.palace = palace;