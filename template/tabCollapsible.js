window.onload = function() {
  // Tab and Collapsible Behavior Functions
  var coll = document.getElementsByClassName("collapsible");
  var i;

    if (!coll || !coll.length) {
            return;
    }

  for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
          var alreadyActive = this.classList.contains('active');
          // first, collapse all buttons
          for (var j = 0; j < coll.length; j++) {
              coll[j].classList.remove("active");
              coll[j].nextElementSibling.style.display = "none";
              coll[j].setAttribute("aria-expanded", "false");
          }
          // then expand the clicked one, if it wasn't already active
          if (!alreadyActive) {
              this.classList.add("active");
              this.nextElementSibling.style.display = "block";
              this.setAttribute("aria-expanded", "true");
          }
      });
  }

  var passwordInput = document.getElementById('password');
  var toggleButton = document.getElementById('togglePassword');

  if (toggleButton && passwordInput) {
      toggleButton.addEventListener('click', function() {
          var isVisible = passwordInput.type === 'text';
          passwordInput.type = isVisible ? 'password' : 'text';
          toggleButton.textContent = isVisible ? 'Show' : 'Hide';
          toggleButton.setAttribute('aria-pressed', String(!isVisible));
      });
  }

  // Carousel section
  var images = document.getElementsByClassName('carouselImage');
  var currentImageIndex = 0;

  if (images && images.length) {
      function changeImage() {
          for (var i = 0; i < images.length; i++) {
              images[i].style.display = 'none'; // hide all images
          }
          images[currentImageIndex].style.display = 'block'; // show current image
          currentImageIndex = (currentImageIndex + 1) % images.length; // go to next image index
      }

      setInterval(changeImage, 3000); // Change image every 3 seconds
  }
};
