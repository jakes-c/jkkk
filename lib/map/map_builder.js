// mapbuilder.js - Super Mario Bros Level Editor

class MapBuilder {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Default options
        this.options = {
            gridSize: 16,
            levelWidth: 3840,
            levelHeight: 240,
            ...options
        };
        
        // Canvas setup
        this.canvas.width = this.options.levelWidth;
        this.canvas.height = this.options.levelHeight;
        
        // Current level data
        this.levelData = this.createEmptyLevel();
        
        // Editor state
        this.selectedTool = 'ground';
        this.selectedElement = null;
        this.isDrawing = false;
        this.lastMousePos = { x: 0, y: 0 };
        
        // Element types and their properties
        this.elementTypes = {
            ground: { color: '#8B4513', size: 16 },
            blocks: { color: '#DAA520', size: 16 },
            bricks: { color: '#CD853F', size: 16 },
            pipes: { color: '#228B22', size: 32 },
            goombas: { color: '#8B4513', size: 16 },
            koopas: { color: '#FF4500', size: 16 },
            coins: { color: '#FFD700', size: 16 },
            mushrooms: { color: '#FF0000', size: 16 },
            breakables: { color: '#A0522D', size: 16 },
            flag: { color: '#FF1493', size: 16 },
            flagpole: { color: '#000000', size: 16 },
            castle: { color: '#696969', size: 80 },
            clouds: { color: '#FFFFFF', size: 32 },
            mountains: { color: '#8FBC8F', size: 48 },
            shrubs: { color: '#32CD32', size: 32 }
        };
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Draw initial grid
        this.render();
    }
    
    createEmptyLevel() {
        return {
            flag: [],
            flagpole: [],
            castle: [],
            blocks: [],
            goombas: [],
            koopas: [],
            smallClouds: [],
            mediumClouds: [],
            largeClouds: [],
            ground: [],
            bricks: [],
            shrubs: [],
            mountains: [],
            pipes: [],
            coins: [],
            mushrooms: [],
            breakables: []
        };
    }
    
    initEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: Math.floor((e.clientX - rect.left) / this.options.gridSize) * this.options.gridSize,
            y: Math.floor((e.clientY - rect.top) / this.options.gridSize) * this.options.gridSize
        };
    }
    
    onMouseDown(e) {
        this.isDrawing = true;
        this.lastMousePos = this.getMousePos(e);
        
        if (e.button === 0) { // Left click - add element
            this.addElement(this.lastMousePos.x, this.lastMousePos.y);
        } else if (e.button === 2) { // Right click - remove element
            this.removeElement(this.lastMousePos.x, this.lastMousePos.y);
        }
        
        this.render();
    }
    
    onMouseMove(e) {
        const mousePos = this.getMousePos(e);
        
        if (this.isDrawing && e.buttons === 1) {
            // Continue drawing for ground and bricks
            if (this.selectedTool === 'ground' || this.selectedTool === 'bricks') {
                this.addElement(mousePos.x, mousePos.y);
                this.render();
            }
        }
        
        this.lastMousePos = mousePos;
    }
    
    onMouseUp(e) {
        this.isDrawing = false;
    }
    
    onKeyDown(e) {
        // Tool shortcuts
        const toolKeys = {
            '1': 'ground',
            '2': 'blocks',
            '3': 'bricks',
            '4': 'pipes',
            '5': 'goombas',
            '6': 'koopas',
            '7': 'coins',
            '8': 'mushrooms',
            '9': 'breakables'
        };
        
        if (toolKeys[e.key]) {
            this.setTool(toolKeys[e.key]);
        }
        
        // Clear level
        if (e.key === 'c' && e.ctrlKey) {
            this.clearLevel();
        }
        
        // Export level
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            this.exportLevel();
        }
    }
    
    setTool(tool) {
        this.selectedTool = tool;
        // Update UI if tool buttons exist
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    addElement(x, y) {
        const elementType = this.elementTypes[this.selectedTool];
        if (!elementType) return;
        
        const size = elementType.size;
        const element = [x, y, size, size];
        
        // Handle special cases
        switch (this.selectedTool) {
            case 'koopas':
                element[3] = 24; // Koopas are taller
                break;
            case 'flagpole':
                element[2] = 16;
                element[3] = 135;
                break;
            case 'castle':
                element[2] = 80;
                element[3] = 80;
                break;
            case 'pipes':
                element[2] = 32;
                element[3] = 64;
                break;
        }
        
        // Check if element already exists at this position
        const category = this.getCategoryForTool(this.selectedTool);
        const exists = this.levelData[category].some(el => 
            el[0] === x && el[1] === y
        );
        
        if (!exists) {
            this.levelData[category].push(element);
        }
    }
    
    removeElement(x, y) {
        // Remove from all categories at this position
        Object.keys(this.levelData).forEach(category => {
            this.levelData[category] = this.levelData[category].filter(element => 
                !(element[0] === x && element[1] === y)
            );
        });
    }
    
    getCategoryForTool(tool) {
        const categoryMap = {
            'ground': 'ground',
            'blocks': 'blocks',
            'bricks': 'bricks',
            'pipes': 'pipes',
            'goombas': 'goombas',
            'koopas': 'koopas',
            'coins': 'coins',
            'mushrooms': 'mushrooms',
            'breakables': 'breakables',
            'flag': 'flag',
            'flagpole': 'flagpole',
            'castle': 'castle',
            'clouds': 'smallClouds',
            'mountains': 'mountains',
            'shrubs': 'shrubs'
        };
        return categoryMap[tool] || 'ground';
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#5C94FC'; // Sky blue background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw all elements
        this.drawElements();
        
        // Draw cursor
        this.drawCursor();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.options.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.options.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawElements() {
        Object.keys(this.levelData).forEach(category => {
            const elements = this.levelData[category];
            const color = this.getColorForCategory(category);
            
            this.ctx.fillStyle = color;
            
            elements.forEach(element => {
                const [x, y, width, height] = element;
                this.ctx.fillRect(x, y, width, height);
                
                // Draw border
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, width, height);
            });
        });
    }
    
    getColorForCategory(category) {
        const colorMap = {
            ground: '#8B4513',
            blocks: '#DAA520',
            bricks: '#CD853F',
            pipes: '#228B22',
            goombas: '#8B4513',
            koopas: '#FF4500',
            coins: '#FFD700',
            mushrooms: '#FF0000',
            breakables: '#A0522D',
            flag: '#FF1493',
            flagpole: '#000000',
            castle: '#696969',
            smallClouds: '#FFFFFF',
            mediumClouds: '#FFFFFF',
            largeClouds: '#FFFFFF',
            mountains: '#8FBC8F',
            shrubs: '#32CD32'
        };
        return colorMap[category] || '#666666';
    }
    
    drawCursor() {
        if (!this.lastMousePos) return;
        
        const elementType = this.elementTypes[this.selectedTool];
        if (!elementType) return;
        
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        let width = elementType.size;
        let height = elementType.size;
        
        // Special sizes for certain tools
        if (this.selectedTool === 'koopas') height = 24;
        if (this.selectedTool === 'flagpole') { width = 16; height = 135; }
        if (this.selectedTool === 'castle') { width = 80; height = 80; }
        if (this.selectedTool === 'pipes') { width = 32; height = 64; }
        
        this.ctx.strokeRect(this.lastMousePos.x, this.lastMousePos.y, width, height);
        this.ctx.setLineDash([]);
    }
    
    clearLevel() {
        if (confirm('Are you sure you want to clear the entire level?')) {
            this.levelData = this.createEmptyLevel();
            this.render();
        }
    }
    
    loadLevel(levelData) {
        this.levelData = { ...this.createEmptyLevel(), ...levelData };
        this.render();
    }
    
    exportLevel() {
        const exportData = {
            ...this.levelData
        };
        
        // Format as JavaScript object
        const jsCode = `export const levelData = ${JSON.stringify(exportData, null, 2)};

export { levelData as default };`;
        
        // Create download
        const blob = new Blob([jsCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'level.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Also log to console
        console.log('Level Data:', exportData);
    }
    
    // Import level from levelOne format
    importLevelOne(levelOneData) {
        const converted = this.createEmptyLevel();
        
        // Map levelOne properties to our format
        if (levelOneData.flag) converted.flag = levelOneData.flag;
        if (levelOneData.flagpole) converted.flagpole = levelOneData.flagpole;
        if (levelOneData.castle) converted.castle = levelOneData.castle;
        if (levelOneData.blocks) converted.blocks = levelOneData.blocks;
        if (levelOneData.goombas) converted.goombas = levelOneData.goombas;
        if (levelOneData.koopas) converted.koopas = levelOneData.koopas;
        if (levelOneData.ground) converted.ground = levelOneData.ground;
        if (levelOneData.bricks) converted.bricks = levelOneData.bricks;
        if (levelOneData.shrubs) converted.shrubs = levelOneData.shrubs;
        if (levelOneData.mountains) converted.mountains = levelOneData.mountains;
        if (levelOneData.pipes) converted.pipes = levelOneData.pipes;
        if (levelOneData.coins) converted.coins = levelOneData.coins;
        if (levelOneData.mushrooms) converted.mushrooms = levelOneData.mushrooms;
        if (levelOneData.breakables) converted.breakables = levelOneData.breakables;
        
        // Handle cloud categories
        if (levelOneData.smallClouds) converted.smallClouds = levelOneData.smallClouds;
        if (levelOneData.mediumClouds) converted.mediumClouds = levelOneData.mediumClouds;
        if (levelOneData.largeClouds) converted.largeClouds = levelOneData.largeClouds;
        
        this.loadLevel(converted);
    }
    
    // Get level statistics
    getLevelStats() {
        const stats = {};
        Object.keys(this.levelData).forEach(category => {
            stats[category] = this.levelData[category].length;
        });
        return stats;
    }
    
    // Utility method to create UI controls
    createUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const toolsHTML = `
            <div class="tools-panel">
                <h3>Tools</h3>
                <div class="tool-grid">
                    ${Object.keys(this.elementTypes).map(tool => 
                        `<button class="tool-btn" data-tool="${tool}" style="background-color: ${this.elementTypes[tool].color}">
                            ${tool.charAt(0).toUpperCase() + tool.slice(1)}
                        </button>`
                    ).join('')}
                </div>
                <div class="controls">
                    <button onclick="mapBuilder.clearLevel()">Clear Level</button>
                    <button onclick="mapBuilder.exportLevel()">Export Level</button>
                </div>
                <div class="stats">
                    <h4>Level Stats</h4>
                    <div id="level-stats"></div>
                </div>
            </div>
        `;
        
        container.innerHTML = toolsHTML;
        
        // Add event listeners to tool buttons
        container.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTool(btn.dataset.tool);
            });
        });
        
        // Set initial tool
        this.setTool('ground');
        
        // Update stats periodically
        setInterval(() => {
            const statsDiv = document.getElementById('level-stats');
            if (statsDiv) {
                const stats = this.getLevelStats();
                statsDiv.innerHTML = Object.keys(stats)
                    .filter(key => stats[key] > 0)
                    .map(key => `${key}: ${stats[key]}`)
                    .join('<br>');
            }
        }, 1000);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapBuilder;
} else if (typeof window !== 'undefined') {
    window.MapBuilder = MapBuilder;
}