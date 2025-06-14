// map_renderer.js - Renders Super Mario Bros levels for gameplay

class MapRenderer {
    constructor(levelData, tileset, spriteSheet) {
        this.levelData = levelData;
        this.tileset = tileset;
        this.spriteSheet = spriteSheet;
        
        // Tile size in the tileset
        this.tileSize = 16;
        
        // Sprite positions in the tileset (x, y coordinates)
        this.tileMap = {
            ground: { x: 0, y: 0 },
            blocks: { x: 16, y: 0 },
            bricks: { x: 32, y: 0 },
            pipes: { x: 48, y: 0 },
            flag: { x: 64, y: 0 },
            flagpole: { x: 80, y: 0 },
            castle: { x: 96, y: 0 },
            coins: { x: 112, y: 0 },
            mushrooms: { x: 128, y: 0 },
            breakables: { x: 144, y: 0 },
            smallClouds: { x: 0, y: 16 },
            mediumClouds: { x: 16, y: 16 },
            largeClouds: { x: 32, y: 16 },
            mountains: { x: 48, y: 16 },
            shrubs: { x: 64, y: 16 }
        };
    }
    
    render(ctx, viewport) {
        // Render background elements first (clouds, mountains, shrubs)
        this.renderBackground(ctx, viewport);
        
        // Render solid terrain
        this.renderTerrain(ctx, viewport);
        
        // Render interactive elements
        this.renderInteractables(ctx, viewport);
        
        // Render enemies (handled separately in game logic)
        // this.renderEnemies(ctx, viewport);
    }
    
    renderBackground(ctx, viewport) {
        // Render clouds
        ['smallClouds', 'mediumClouds', 'largeClouds'].forEach(cloudType => {
            if (this.levelData[cloudType]) {
                this.renderElements(ctx, viewport, this.levelData[cloudType], cloudType);
            }
        });
        
        // Render mountains
        if (this.levelData.mountains) {
            this.renderElements(ctx, viewport, this.levelData.mountains, 'mountains');
        }
        
        // Render shrubs
        if (this.levelData.shrubs) {
            this.renderElements(ctx, viewport, this.levelData.shrubs, 'shrubs');
        }
    }
    
    renderTerrain(ctx, viewport) {
        // Render ground
        if (this.levelData.ground) {
            this.renderElements(ctx, viewport, this.levelData.ground, 'ground');
        }
        
        // Render bricks
        if (this.levelData.bricks) {
            this.renderElements(ctx, viewport, this.levelData.bricks, 'bricks');
        }
        
        // Render blocks
        if (this.levelData.blocks) {
            this.renderElements(ctx, viewport, this.levelData.blocks, 'blocks');
        }
        
        // Render breakables
        if (this.levelData.breakables) {
            this.renderElements(ctx, viewport, this.levelData.breakables, 'breakables');
        }
        
        // Render pipes
        if (this.levelData.pipes) {
            this.renderElements(ctx, viewport, this.levelData.pipes, 'pipes');
        }
    }
    
    renderInteractables(ctx, viewport) {
        // Render coins
        if (this.levelData.coins) {
            this.renderElements(ctx, viewport, this.levelData.coins, 'coins');
        }
        
        // Render mushrooms
        if (this.levelData.mushrooms) {
            this.renderElements(ctx, viewport, this.levelData.mushrooms, 'mushrooms');
        }
        
        // Render flag and flagpole
        if (this.levelData.flagpole) {
            this.renderElements(ctx, viewport, this.levelData.flagpole, 'flagpole');
        }
        
        if (this.levelData.flag) {
            this.renderElements(ctx, viewport, this.levelData.flag, 'flag');
        }
        
        // Render castle
        if (this.levelData.castle) {
            this.renderElements(ctx, viewport, this.levelData.castle, 'castle');
        }
    }
    
    renderElements(ctx, viewport, elements, elementType) {
        const tileInfo = this.tileMap[elementType];
        if (!tileInfo) {
            console.warn(`No tile mapping for element type: ${elementType}`);
            return;
        }
        
        elements.forEach(element => {
            const [x, y, width, height] = element;
            
            // Only render if element is visible in viewport
            if (x + width >= viewport.vX && 
                x <= viewport.vX + viewport.width &&
                y + height >= viewport.vY && 
                y <= viewport.vY + viewport.height) {
                
                // Calculate screen position
                const screenX = x - viewport.vX;
                const screenY = y - viewport.vY;
                
                // Handle different rendering methods based on element type
                if (elementType === 'pipes') {
                    this.renderPipe(ctx, screenX, screenY, width, height);
                } else if (elementType === 'flagpole') {
                    this.renderFlagpole(ctx, screenX, screenY, width, height);
                } else if (elementType === 'castle') {
                    this.renderCastle(ctx, screenX, screenY, width, height);
                } else {
                    // Standard tile rendering
                    this.renderTile(ctx, screenX, screenY, width, height, tileInfo);
                }
            }
        });
    }
    
    renderTile(ctx, x, y, width, height, tileInfo) {
        // For repeating tiles, tile the sprite across the width/height
        const tilesX = Math.ceil(width / this.tileSize);
        const tilesY = Math.ceil(height / this.tileSize);
        
        for (let tileX = 0; tileX < tilesX; tileX++) {
            for (let tileY = 0; tileY < tilesY; tileY++) {
                const drawX = x + (tileX * this.tileSize);
                const drawY = y + (tileY * this.tileSize);
                
                const drawWidth = Math.min(this.tileSize, width - (tileX * this.tileSize));
                const drawHeight = Math.min(this.tileSize, height - (tileY * this.tileSize));
                
                ctx.drawImage(
                    this.tileset,
                    tileInfo.x, tileInfo.y, drawWidth, drawHeight,
                    drawX, drawY, drawWidth, drawHeight
                );
            }
        }
    }
    
    renderPipe(ctx, x, y, width, height) {
        // Render pipe with special handling for top and body
        const pipeTop = this.tileMap.pipes;
        
        // Draw pipe body (repeated)
        const bodySegments = Math.floor((height - 16) / 16);
        for (let i = 0; i < bodySegments; i++) {
            ctx.drawImage(
                this.tileset,
                pipeTop.x, pipeTop.y + 16, 32, 16,
                x, y + 16 + (i * 16), width, 16
            );
        }
        
        // Draw pipe top
        ctx.drawImage(
            this.tileset,
            pipeTop.x, pipeTop.y, 32, 16,
            x, y, width, 16
        );
    }
    
    renderFlagpole(ctx, x, y, width, height) {
        const flagpoleSprite = this.tileMap.flagpole;
        
        // Render flagpole as vertical segments
        const segments = Math.ceil(height / this.tileSize);
        for (let i = 0; i < segments; i++) {
            const segmentY = y + (i * this.tileSize);
            const segmentHeight = Math.min(this.tileSize, height - (i * this.tileSize));
            
            ctx.drawImage(
                this.tileset,
                flagpoleSprite.x, flagpoleSprite.y, width, segmentHeight,
                x, segmentY, width, segmentHeight
            );
        }
    }
    
    renderCastle(ctx, x, y, width, height) {
        const castleSprite = this.tileMap.castle;
        
        // Render castle as a single large sprite or tiled
        ctx.drawImage(
            this.tileset,
            castleSprite.x, castleSprite.y, 80, 80,
            x, y, width, height
        );
    }
    
    // Collision detection methods
    getCollisionData() {
        const collisionElements = [];
        
        // Add solid elements for collision detection
        ['ground', 'blocks', 'bricks', 'breakables', 'pipes'].forEach(elementType => {
            if (this.levelData[elementType]) {
                this.levelData[elementType].forEach(element => {
                    collisionElements.push({
                        type: elementType,
                        x: element[0],
                        y: element[1],
                        width: element[2],
                        height: element[3]
                    });
                });
            }
        });
        
        return collisionElements;
    }
    
    // Check if position collides with solid terrain
    checkCollision(x, y, width, height) {
        const collisionData = this.getCollisionData();
        
        return collisionData.some(element => {
            return x < element.x + element.width &&
                   x + width > element.x &&
                   y < element.y + element.height &&
                   y + height > element.y;
        });
    }
    
    // Get elements of specific type at position (for pickups, etc.)
    getElementsAt(x, y, width, height, elementType) {
        if (!this.levelData[elementType]) return [];
        
        return this.levelData[elementType].filter(element => {
            return x < element[0] + element[2] &&
                   x + width > element[0] &&
                   y < element[1] + element[3] &&
                   y + height > element[1];
        });
    }
    
    // Remove element (for collected coins, broken blocks, etc.)
    removeElement(elementType, x, y) {
        if (!this.levelData[elementType]) return false;
        
        const index = this.levelData[elementType].findIndex(element => 
            element[0] === x && element[1] === y
        );
        
        if (index !== -1) {
            this.levelData[elementType].splice(index, 1);
            return true;
        }
        
        return false;
    }
    
    // Add element (for spawning items, etc.)
    addElement(elementType, x, y, width, height) {
        if (!this.levelData[elementType]) {
            this.levelData[elementType] = [];
        }
        
        this.levelData[elementType].push([x, y, width, height]);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapRenderer;
} else if (typeof window !== 'undefined') {
    window.MapRenderer = MapRenderer;
}