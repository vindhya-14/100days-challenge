const runButton = document.getElementById('run');
    const clearButton = document.getElementById('clear');
    const example1Button = document.getElementById('example1');
    const example2Button = document.getElementById('example2');
    const codeBox = document.getElementById('code');
    const speedControl = document.getElementById('speed');
    const speedValue = document.getElementById('speed-value');
    
    // Visualizer elements
    const stackEl = document.getElementById('stack');
    const microtaskEl = document.getElementById('microtask');
    const macrotaskEl = document.getElementById('macrotask');
    const webapisEl = document.getElementById('webapis');
    const consoleEl = document.getElementById('console');
    
    // Status indicators
    const stackStatus = document.getElementById('stack-status');
    const microtaskStatus = document.getElementById('microtask-status');
    const macrotaskStatus = document.getElementById('macrotask-status');
    const webapisStatus = document.getElementById('webapis-status');
    
    // Tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Animation speed (default 500ms)
    let animationSpeed = 500;
    
    // Initialize
    function init() {
      // Set up event listeners
      runButton.addEventListener('click', runCode);
      clearButton.addEventListener('click', clearAll);
      example1Button.addEventListener('click', loadExample1);
      example2Button.addEventListener('click', loadExample2);
      speedControl.addEventListener('input', updateSpeed);
      
      // Set up tabs
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          tab.classList.add('active');
          document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
      });
      
      // Initial speed display
      updateSpeed();
    }
    
    // Update animation speed
    function updateSpeed() {
      animationSpeed = parseInt(speedControl.value);
      const speedFactor = (1000 - animationSpeed + 50) / 1000;
      speedValue.textContent = `${speedFactor.toFixed(1)}x`;
    }
    
    // Clear all visualizations
    function clearAll() {
      stackEl.innerHTML = '';
      microtaskEl.innerHTML = '';
      macrotaskEl.innerHTML = '';
      webapisEl.innerHTML = '';
      consoleEl.innerHTML = '<div class="console-line">Console output will appear here...</div>';
      
      // Reset statuses
      stackStatus.textContent = 'Idle';
      stackStatus.className = 'block-status';
      microtaskStatus.textContent = 'Empty';
      microtaskStatus.className = 'block-status';
      macrotaskStatus.textContent = 'Empty';
      macrotaskStatus.className = 'block-status';
      webapisStatus.textContent = 'Idle';
      webapisStatus.className = 'block-status';
    }
    
    // Add item to a container with animation
    async function addItem(container, text, type = '') {
      const li = document.createElement('li');
      li.textContent = text;
      
      // Add type class for styling
      if (type) {
        li.classList.add(type);
      }
      
      container.appendChild(li);
      
      // Scroll to bottom
      container.scrollTop = container.scrollHeight;
      
      // Update status
      updateStatus(container.id);
      
      // Animation
      li.style.opacity = '0';
      li.style.transform = 'translateY(10px)';
      
      await delay(50);
      
      li.style.transition = 'all 0.3s ease';
      li.style.opacity = '1';
      li.style.transform = 'translateY(0)';
      
      await delay(50);
    }
    
    // Remove item from a container with animation
    async function removeItem(container) {
      if (container.children.length > 0) {
        const li = container.lastElementChild;
        
        li.style.transition = 'all 0.3s ease';
        li.style.opacity = '0';
        li.style.transform = 'translateY(-10px)';
        
        await delay(300);
        li.remove();
        
        updateStatus(container.id);
      }
    }
    
    // Update status indicators
    function updateStatus(containerId) {
      switch (containerId) {
        case 'stack':
          stackStatus.textContent = stackEl.children.length ? 'Running' : 'Idle';
          stackStatus.className = stackEl.children.length ? 'block-status active' : 'block-status';
          break;
        case 'microtask':
          microtaskStatus.textContent = microtaskEl.children.length ? 'Pending' : 'Empty';
          microtaskStatus.className = microtaskEl.children.length ? 'block-status active' : 'block-status';
          break;
        case 'macrotask':
          macrotaskStatus.textContent = macrotaskEl.children.length ? 'Pending' : 'Empty';
          macrotaskStatus.className = macrotaskEl.children.length ? 'block-status active' : 'block-status';
          break;
        case 'webapis':
          webapisStatus.textContent = webapisEl.children.length ? 'Processing' : 'Idle';
          webapisStatus.className = webapisEl.children.length ? 'block-status active' : 'block-status';
          break;
      }
    }
    
    // Add console output
    async function addConsoleOutput(text) {
      const line = document.createElement('div');
      line.className = 'console-line';
      line.textContent = text;
      
      // If it's the initial placeholder, replace it
      if (consoleEl.children.length === 1 && consoleEl.firstChild.textContent === 'Console output will appear here...') {
        consoleEl.innerHTML = '';
      }
      
      consoleEl.appendChild(line);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      
      // Animation
      line.style.opacity = '0';
      line.style.transform = 'translateY(10px)';
      
      await delay(50);
      
      line.style.transition = 'all 0.3s ease';
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }
    
    // Delay helper function
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms * (animationSpeed / 500)));
    }
    
    // Load example 1
    function loadExample1() {
      codeBox.value = `console.log('Start');
      
setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

console.log('End');`;
    }
    
    // Load example 2
    function loadExample2() {
      codeBox.value = `console.log('Script start');

setTimeout(() => console.log('setTimeout'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => {
    console.log('Promise 2');
    return Promise.resolve();
  })
  .then(() => {
    console.log('Promise 3');
  });

console.log('Script end');`;
    }
    
    // Main function to run the code visualization
    async function runCode() {
      clearAll();
      
      // Get the code from textarea
      const code = codeBox.value;
      
      try {
        // This is a simulation - we're not actually executing the code
        // We'll parse it and simulate the event loop behavior
        
        // Split code into lines
        const lines = code.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('console.log(')) {
            // Simulate synchronous console.log
            await addItem(stackEl, trimmedLine, 'sync');
            await delay(300);
            
            // Extract the log message
            const message = trimmedLine.match(/console\.log\(['"](.*)['"]\)/)[1];
            await addConsoleOutput(message);
            
            await removeItem(stackEl);
          }
          else if (trimmedLine.includes('setTimeout')) {
            // Simulate setTimeout
            await addItem(stackEl, trimmedLine, 'sync');
            await delay(300);
            
            // Extract the callback and delay
            const match = trimmedLine.match(/setTimeout\(\(\)\s*=>\s*console\.log\(['"](.*)['"]\),\s*(\d+)\)/);
            const message = match[1];
            const timeout = parseInt(match[2]);
            
            // Move to Web APIs
            await addItem(webapisEl, `setTimeout (${timeout}ms) → "${message}"`, 'webapi');
            await removeItem(stackEl);
            
            // Simulate timeout completion (even if 0, it goes to macrotask queue)
            await delay(300);
            await removeItem(webapisEl);
            await addItem(macrotaskEl, `() => console.log("${message}")`, 'macrotask');
          }
          else if (trimmedLine.includes('Promise.resolve().then')) {
            // Simulate Promise
            await addItem(stackEl, trimmedLine, 'sync');
            await delay(300);
            
            // Extract the callback
            const message = trimmedLine.match(/\.then\(\(\)\s*=>\s*console\.log\(['"](.*)['"]\)\)/)[1];
            
            // Move to microtask queue
            await addItem(microtaskEl, `() => console.log("${message}")`, 'microtask');
            await removeItem(stackEl);
          }
          else if (trimmedLine.includes('Promise.resolve()') && trimmedLine.includes('.then')) {
            // Handle multi-line promise chains
            await addItem(stackEl, trimmedLine, 'sync');
            await delay(300);
            
            // This is simplified - a real implementation would parse the full chain
            const messages = [];
            let currentLine = trimmedLine;
            
            while (currentLine.includes('.then')) {
              const match = currentLine.match(/\.then\(\(\)\s*=>\s*console\.log\(['"](.*)['"]\)/);
              if (match) {
                messages.push(match[1]);
                currentLine = currentLine.substring(currentLine.indexOf('.then') + 5);
              } else {
                break;
              }
            }
            
            for (const message of messages) {
              await addItem(microtaskEl, `() => console.log("${message}")`, 'microtask');
            }
            
            await removeItem(stackEl);
          }
        }
        
        // After all synchronous code is done, process microtasks
        while (microtaskEl.children.length > 0) {
          const task = microtaskEl.lastElementChild.textContent;
          const message = task.match(/console\.log\(['"](.*)['"]\)/)[1];
          
          await addItem(stackEl, task, 'microtask');
          await delay(300);
          await addConsoleOutput(message);
          await removeItem(stackEl);
          await removeItem(microtaskEl);
        }
        
        // Then process one macrotask
        if (macrotaskEl.children.length > 0) {
          const task = macrotaskEl.lastElementChild.textContent;
          const message = task.match(/console\.log\(['"](.*)['"]\)/)[1];
          
          await addItem(stackEl, task, 'macrotask');
          await delay(300);
          await addConsoleOutput(message);
          await removeItem(stackEl);
          await removeItem(macrotaskEl);
        }
        
        // In a real event loop, this would continue until all queues are empty
        // For our simulation, we'll just do one macrotask cycle
        
      } catch (error) {
        await addConsoleOutput(`Error: ${error.message}`);
      }
    }
    
    // Initialize the app
    init();