import { Application, Ticker } from 'pixi.js';
import { Live2DSprite } from 'easy-live2d';

document.addEventListener('DOMContentLoaded', async () => {
    const closeBtn = document.getElementById('close-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.electronAPI.closeDashboard();
        });
    }

    // 1. Initialize Live2D Avatar
    const canvas = document.getElementById('live2d-dashboard');
    if (canvas) {
        const app = new Application();
        await app.init({
            canvas: canvas,
            backgroundAlpha: 0,
            resizeTo: canvas.parentElement, // Fit the container
        });

        const live2dSprite = new Live2DSprite();
        try {
            await live2dSprite.init({
                modelPath: '/live2d/Hiyori/Hiyori.model3.json',
                ticker: Ticker.shared
            });

            // Adjust scale and position for side view
            // Make it fit nicely in the 380px wide container
            // Height is main constraint if full screen, but width is tight
            const scale = (app.screen.height / live2dSprite.height) * 2;
            live2dSprite.scale.set(scale);

            // Center horizontally in the avatar container
            live2dSprite.x = (app.screen.width - live2dSprite.width) / 2.3;

            app.stage.addChild(live2dSprite);
            console.log('Dashboard Avatar initialized');
        } catch (e) {
            console.error('Dashboard Avatar Load Failed:', e);
        }
    }

    // Dynamic Chart or Data logic
    console.log('Dashboard loaded');

    // Generate GitHub-style Contribution Grid
    const gridContainer = document.querySelector('.contribution-grid');
    const monthsContainer = document.querySelector('.months-label');

    if (gridContainer && monthsContainer) {
        gridContainer.innerHTML = '';
        monthsContainer.innerHTML = '';

        // Configuration
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const totalWeeks = 53; // Full year view

        // Generate Months Labels
        // Just purely distributing them for now, or could calculate based on week index
        // Simplified: Add a label every ~4 weeks
        months.forEach(m => {
            const span = document.createElement('span');
            span.textContent = m;
            monthsContainer.appendChild(span);
        });

        // Generate Grid: 53 Columns (Weeks) x 7 Rows (Days)
        for (let week = 0; week < totalWeeks; week++) {
            const weekCol = document.createElement('div');
            weekCol.classList.add('grid-week');

            for (let day = 0; day < 7; day++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');

                // Randomly assign activity level
                // Higher chance for "empty" to look realistic
                const rand = Math.random();
                let level = 0;
                if (rand > 0.85) level = 1;
                else if (rand > 0.92) level = 2;
                else if (rand > 0.96) level = 3;
                else if (rand > 0.99) level = 4;

                cell.classList.add(`level-${level}`);

                // Tooltip or title (optional)
                // cell.title = `Activity: ${level}`;

                weekCol.appendChild(cell);
            }
            gridContainer.appendChild(weekCol);
        }
    }
});
