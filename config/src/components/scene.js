export function initScene() {
  const sceneContainer = document.getElementById("scene-container");

  sceneContainer.innerHTML = /*html*/ `
    <div class="flex items-center justify-center h-full relative bg-background">
      
      <div class="absolute inset-0 opacity-30">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-primary)" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div class="z-10 text-center px-8">
        <div class="mb-6">
          <svg class="w-24 h-24 mx-auto text-primary-light animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        
        <h2 class="text-4xl font-semibold text-gray-800 mb-4">
          Please Configure System
        </h2>
        <p class="text-gray-600 text-lg">
          Click the buttons on the left to configure each component
        </p>

        <div class="mt-8 flex justify-center gap-4">
          <div class="px-4 py-2 bg-primary/10 rounded-lg border border-primary">
            <span class="text-primary-dark font-medium text-sm">Step 1:</span>
            <span class="text-primary ml-2 font-semibold">Robot</span>
          </div>
          <div class="px-4 py-2 bg-primary/10 rounded-lg border border-primary">
            <span class="text-primary-dark font-medium text-sm">Step 2:</span>
            <span class="text-primary ml-2 font-semibold">Camera</span>
          </div>
          <div class="px-4 py-2 bg-primary/10 rounded-lg border border-primary">
            <span class="text-primary-dark font-medium text-sm">Step 3:</span>
            <span class="text-primary ml-2 font-semibold">Camera Config</span>
          </div>
          <div class="px-4 py-2 bg-primary/10 rounded-lg border border-primary">
            <span class="text-primary-dark font-medium text-sm">Step 4:</span>
            <span class="text-primary ml-2 font-semibold">EOAT</span>
          </div>
        </div>
      </div>
      
    </div>
  `;
}
