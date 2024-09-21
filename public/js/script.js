document.addEventListener("DOMContentLoaded", function() {
  console.log("Page is fully loaded and script is running!");

  // Add Ingredients functionality
  let addIngredientsBtn = document.getElementById('addIngredientsBtn');
  if (addIngredientsBtn) {
      let ingredientList = document.querySelector('.ingredientList');
      let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];
    
      addIngredientsBtn.addEventListener('click', function(){
        let newIngredients = ingredientDiv.cloneNode(true);
        let input = newIngredients.getElementsByTagName('input')[0];
        input.value = '';
        ingredientList.appendChild(newIngredients);
      });
  }

  // Form validation
  const forms = document.querySelectorAll('.needs-validation');
  console.log("Starting form validation logic");

  Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
          }
          form.classList.add('was-validated');
      }, false);
  });
});
