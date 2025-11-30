// Elements (We need to select these dynamically or ensure they exist)
document.addEventListener('DOMContentLoaded', () => {
  const newCategoryRow = document.getElementById('new-category-row');
  const newGameRow = document.getElementById('new-game-row');

  // Dialog elements
  const deleteDialog = document.getElementById('delete-dialog');
  const dialogPasswordInput = document.getElementById('dialog-password-input');
  const dialogErrorMsg = document.getElementById('dialog-error-msg');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

  // Form elements
  const categoryAddForm = document.getElementById('category-add');
  const categoryUpdateForm = document.getElementById('category-update');
  const gameAddForm = document.getElementById('game-add');
  const gameUpdateForm = document.getElementById('game-update');

  // State
  let pendingDelete = { id: null, type: null };

  function handleKeys(e) {
    if (e.key === 'Enter') {
      // Prevent default unless it's a textarea
      if (e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();

        // Check if we are in a game category add container (Handled by gameCategoryManager.js, but we can keep safety check or remove if fully separated)
        if (e.target.closest('.add-category-container')) {
          return;
        }

        const item = e.target.closest('.category, .game');
        if (item) {
          const saveBtn = item.querySelector('.btn-save');
          if (saveBtn) saveBtn.click();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();

      if (e.target.closest('.add-category-container')) {
        return; // Handled by gameCategoryManager.js
      }

      const item = e.target.closest('.category, .game');
      if (item) {
        const cancelBtn = item.querySelector('.btn-cancel');
        if (cancelBtn) cancelBtn.click();
      }
    }
  }

  function showError(message) {
    if (window.showToast) {
      window.showToast(message, 'error');
    } else {
      alert(message);
    }
  }

  function hideError() {
    // No-op as toast auto-hides or is managed separately
  }

  function submitForm(form, action, fields) {
    if (action) form.action = action;
    for (const [name, value] of Object.entries(fields)) {
      const input = form.querySelector(`[name="${name}"]`);
      if (input) input.value = value;
    }
    form.submit();
  }

  function handleAddButton(type, btn) {
    // Select the specific row based on type
    const row = type === 'category' ? newCategoryRow : newGameRow;

    // Toggle visibility: Show container, hide button
    row.querySelector('.add-container').hidden = false;
    btn.hidden = true;

    // Focus the input
    row.querySelector('.inline-add-input').focus();
  }

  function handleEditButton(item) {
    const nameDisplay = item.querySelector('.name');
    const descriptionDisplay = item.querySelector('.description');
    const priceDisplay = item.querySelector('.price');
    const editContainer = item.querySelector('.edit-container');
    const editBtn = item.querySelector('.btn-edit');
    const nameInput = item.querySelector('.inline-edit-input');

    nameDisplay.hidden = true;
    if (descriptionDisplay) descriptionDisplay.hidden = true;
    if (priceDisplay) priceDisplay.hidden = true;

    editContainer.hidden = false;
    editBtn.hidden = true;
    nameInput.focus();
  }

  function handleSaveButton(item, isNew, id, type) {
    if (type === 'category') {
      const nameInput = isNew
        ? item.querySelector('.inline-add-input')
        : item.querySelector('.inline-edit-input');

      if (isNew) {
        submitForm(categoryAddForm, null, { name: nameInput.value });
      } else {
        submitForm(categoryUpdateForm, `/categories/${id}/update`, {
          name: nameInput.value,
        });
      }
    } else if (type === 'game') {
      const nameInput = isNew
        ? item.querySelector('.inline-add-input')
        : item.querySelector('.inline-edit-input');
      const descInput = item.querySelector('.inline-add-description');
      const priceInput = item.querySelector('.inline-add-price');

      const data = {
        name: nameInput.value,
        description: descInput.value,
        price: priceInput.value,
      };

      if (isNew) {
        submitForm(gameAddForm, null, data);
      } else {
        submitForm(gameUpdateForm, `/games/${id}/update`, data);
      }
    }
  }

  function handleCancelButton(item, isNew, type) {
    if (isNew) {
      // Toggle visibility: Hide container, show button
      item.querySelector('.add-container').hidden = true;
      item.querySelector('.btn-add').hidden = false;

      // Clear inputs
      item
        .querySelectorAll('input, textarea')
        .forEach((input) => (input.value = ''));
    } else {
      const nameDisplay = item.querySelector('.name');
      const descriptionDisplay = item.querySelector('.description');
      const priceDisplay = item.querySelector('.price');
      const editContainer = item.querySelector('.edit-container');
      const editBtn = item.querySelector('.btn-edit');

      nameDisplay.hidden = false;
      if (descriptionDisplay) descriptionDisplay.hidden = false;
      if (priceDisplay) priceDisplay.hidden = false;

      editContainer.hidden = true;
      editBtn.hidden = false;
    }
  }

  function handleDeleteButton(id, type) {
    pendingDelete = { id, type };
    dialogPasswordInput.value = '';
    hideError();
    deleteDialog.showModal();
  }

  async function handleConfirmDelete() {
    const password = dialogPasswordInput.value;
    const { id, type } = pendingDelete;

    const endpoint =
      type === 'category' ? `/categories/${id}/delete` : `/games/${id}/delete`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove from DOM
        const item = document.querySelector(`.${type}[data-id="${id}"]`);
        if (item) item.remove();

        if (window.showToast) {
          window.showToast(data.message || 'Deleted successfully', 'success');
        }
        deleteDialog.close();
      } else {
        showError(data.errors?.[0]?.msg || 'An error occurred');
      }
    } catch (err) {
      console.error('Error: ', err);
      showError('Server Error');
    }
  }

  // Event Listeners

  // Add keydown listeners to all inputs within categories and games
  document
    .querySelectorAll('.category input, .game input, .game textarea')
    .forEach((input) => {
      input.addEventListener('keydown', handleKeys);
    });

  // Dialog handling
  if (dialogPasswordInput) {
    dialogPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmDeleteBtn.click();
      }
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
  }

  // Main delegation
  document.addEventListener('click', (e) => {
    // Handle add buttons
    if (e.target.classList.contains('btn-add')) {
      const isGame = e.target.closest('main') !== null;
      handleAddButton(isGame ? 'game' : 'category', e.target);
      return;
    }

    const item = e.target.closest('.category, .game');
    if (!item) return;

    // Determine type and state
    const isGame = item.classList.contains('game');
    const type = isGame ? 'game' : 'category';
    const isNew = item.id === 'new-category-row' || item.id === 'new-game-row';
    const id = item.dataset.id; // Will be undefined for new rows

    if (e.target.classList.contains('btn-edit')) {
      handleEditButton(item);
    } else if (e.target.classList.contains('btn-save')) {
      handleSaveButton(item, isNew, id, type);
    } else if (e.target.classList.contains('btn-cancel')) {
      handleCancelButton(item, isNew, type);
    } else if (e.target.classList.contains('btn-delete')) {
      handleDeleteButton(id, type);
    }
  });
});
