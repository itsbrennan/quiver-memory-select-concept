const container = document.querySelector('.container');
const memoryBlocksAvailable = document.querySelectorAll(
  '.row .memory-block:not(.occupied)'
);
const count = document.getElementById('count');
const total = document.getElementById('total');
const clearBtn = document.getElementById('clear-selected');
const memorySelect = document.getElementById('memory');
const summaryGroup = document.querySelector('.summary-group');

populateUI();

let memoryPrice = parseInt(memorySelect.value);

// save selected memory Index and price
function setMemoryData(memoryIndex, memoryPrice) {
  localStorage.setItem('selectedMemoryIndex', memoryIndex);
  localStorage.setItem('selectedMemoryPrice', memoryPrice);
}

// update total and count
function updateSelectedCountAndTotal() {
  // grab node list of selected memory blocks
  const selectedMemoryBlocks = document.querySelectorAll(
    '.row .memory-block.selected'
  );
  // add memory block to summary if something is selected
  if (selectedMemoryBlocks.length > 0 && selectedMemoryBlocks !== null) {
    clearBtn.classList.remove('d-none');
    addBlockToSummary();
  } else {
    clearBtn.classList.add('d-none');
  }
  // convert nodeList to arr and run indexOf
  const memoryBlockIndex = [...selectedMemoryBlocks].map(block =>
    [...memoryBlocksAvailable].indexOf(block)
  );

  // convert arr to string and save to LS
  localStorage.setItem(
    'memoryBlocksSelected',
    JSON.stringify(memoryBlockIndex)
  );

  const memoryBlocksCount = selectedMemoryBlocks.length;
  count.innerText = memoryBlocksCount;
  total.innerText = memoryBlocksCount * memoryPrice;
}

function clearSelected() {
  const selectedMemoryBlocks = document.querySelectorAll(
    '.row .memory-block.selected'
  );
  selectedMemoryBlocks.forEach(item => {
    item.classList.remove('selected');
  });
  summaryGroup.innerHTML = '';
  localStorage.clear();
  updateSelectedCountAndTotal();
}

// Get data from LS and populate UI
function populateUI() {
  // get selected memory from LS and turn into arr
  const selectedMemoryBlocks = JSON.parse(
    localStorage.getItem('memoryBlocksSelected')
  );
  if (selectedMemoryBlocks !== null && selectedMemoryBlocks.length > 0) {
    // toggle clear btn
    clearBtn.classList.add('d-none');
    memoryBlocksAvailable.forEach((memoryBlock, index) => {
      if (selectedMemoryBlocks.indexOf(index) > -1) {
        memoryBlock.classList.add('selected');
        addBlockToSummary();
      }
    });
  }

  const selectedMemoryIndex = localStorage.getItem('selectedMemoryIndex');
  if (selectedMemoryIndex !== null) {
    memorySelect.selectedIndex = selectedmemoryIndex;
  }
}

function addBlockToSummary() {
  const memoryBlocksSelected = document.querySelectorAll(
    '.row .memory-block.selected'
  );

  if (memoryBlocksSelected.length > 0) {
    let html = '';
    memoryBlocksSelected.forEach((item, index) => {
      html += `<div class="summary-item" data-index="${index}">
    <span class="summary-item--close fas fa-times-circle"></span>
    <div class="summary-block--text">5GB</div>
    <div class="summary-block--sub-text">Memory Block Selected</div>
  </div>`;
    });
    summaryGroup.innerHTML = html;
    const lastChild = document.querySelector('.summary-item:last-child');
    lastChild.classList.add('fade-in');
  }
}

//clear selected listener
clearBtn.addEventListener('click', () => {
  clearSelected();
});

// memory Select / dropdown Event Listener
memorySelect.addEventListener('change', e => {
  memoryPrice = parseInt(e.target.value);
  setMemoryData(e.target.selectedIndex, e.target.value);
  updateSelectedCountAndTotal();
});

// memory block click Event Listener
container.addEventListener('click', e => {
  if (
    e.target.classList.contains('memory-block') &&
    !e.target.classList.contains('occupied')
  ) {
    // if memory-block is available
    e.target.classList.toggle('selected');

    const summaryItems = summaryGroup.querySelectorAll('.summary-item');
    if (summaryItems.length > 0) {
      summaryItems[0].remove();
    }
    updateSelectedCountAndTotal();
  }
});

// summary group listener for deleting specific item
summaryGroup.addEventListener('click', e => {
  if (e.target.classList.contains('fa-times-circle')) {
    // traverse dom
    e.target.parentNode.classList.remove('fade-in');
    e.target.parentNode.classList.add('fade-out');
    setTimeout(function() {
      e.target.parentNode.classList.remove('fade-out');
      e.target.parentNode.remove();
    }, 500);

    let selectedBlocks = document.querySelectorAll(
      '.row .memory-block.selected'
    );
    let lastSelectedBlock = selectedBlocks.length - 1;
    selectedBlocks[lastSelectedBlock].classList.remove('selected');
    updateSelectedCountAndTotal();
  }
});

// initial count and total set
updateSelectedCountAndTotal();
