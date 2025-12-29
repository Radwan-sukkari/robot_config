export function initScene() {
  const sceneContainer = document.getElementById('scene-container');
  sceneContainer.innerHTML = /*html*/`
    <div class="flex items-center justify-center h-full relative">
      <!-- Grid Background -->
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <!-- Text -->
      <h2 class="text-4xl font-light italic text-gray-400 z-10">
        please configure System
      </h2>
    </div>
  `;
}