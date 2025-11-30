// Helper to submit forms (Global scope to be accessible by inline scripts if needed)
function submitForm(form, action, fields) {
  if (action) form.action = action;
  for (const [name, value] of Object.entries(fields)) {
    const input = form.querySelector(`[name="${name}"]`);
    if (input) input.value = value;
  }
  form.submit();
}

document.addEventListener('DOMContentLoaded', () => {
  const gameAddCategoryForm = document.getElementById('game-add-category');
  const gameRemoveCategoryForm = document.getElementById(
    'game-remove-category'
  );

  function handleGameCategoryAction(e) {
    const target = e.target;
    const gameCard = target.closest('.game');
    if (!gameCard) return;

    const gameId = gameCard.dataset.id;

    if (target.classList.contains('btn-remove-category')) {
      const categoryItem = target.closest('.game-category-item');
      const categoryId = categoryItem.dataset.id;
      submitForm(gameRemoveCategoryForm, `/games/${gameId}/removeCategory`, {
        categoryId: categoryId,
      });
    } else if (target.classList.contains('btn-add-category')) {
      const wrapper = target.closest('.add-category-wrapper');
      const container = wrapper.querySelector('.add-category-container');
      target.hidden = true;
      container.hidden = false;
      container.querySelector('select').focus();
    } else if (target.classList.contains('btn-cancel-category')) {
      const wrapper = target.closest('.add-category-wrapper');
      const container = wrapper.querySelector('.add-category-container');
      const addBtn = wrapper.querySelector('.btn-add-category');
      container.hidden = true;
      addBtn.hidden = false;
      container.querySelector('select').selectedIndex = 0;
    } else if (target.classList.contains('btn-save-category')) {
      const wrapper = target.closest('.add-category-wrapper');
      const select = wrapper.querySelector('.inline-category-select');
      const categoryId = select.value;

      if (!categoryId) {
        alert('Please select a category');
        return;
      }

      submitForm(gameAddCategoryForm, `/games/${gameId}/addCategory`, {
        categoryId: categoryId,
      });
    }
  }

  // Event Delegation for Clicks
  document.addEventListener('click', (e) => {
    if (
      e.target.matches(
        '.btn-remove-category, .btn-add-category, .btn-cancel-category, .btn-save-category'
      )
    ) {
      handleGameCategoryAction(e);
    }
  });

  // Event Delegation for Keyboard Shortcuts (Enter/Escape)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.target.closest('.add-category-container')) {
        e.preventDefault();
        const container = e.target.closest('.add-category-container');
        container.querySelector('.btn-save-category').click();
      }
    } else if (e.key === 'Escape') {
      if (e.target.closest('.add-category-container')) {
        e.preventDefault();
        const container = e.target.closest('.add-category-container');
        container.querySelector('.btn-cancel-category').click();
      }
    }
  });
});
