document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const vehicleOptions = document.querySelectorAll('.vehicle-option');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const serviceCards = document.querySelectorAll('.service-card');
    const selectButtons = document.querySelectorAll('.select-btn');
    let currentStep = 0;

    // Initialize
    updateButtons();

     // Enable service selection when clicking the "SELECT SERVICE" button
    selectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const parentCard = this.closest('.service-card');
            
            // Remove selection from all cards
            serviceCards.forEach(card => {
                card.classList.remove('selected');
                
                // Change button text back to "SELECT SERVICE" for all cards
                const buttonElement = card.querySelector('.select-btn');
                if (buttonElement) {
                    buttonElement.textContent = 'SELECT SERVICE';
                }
                
                // Remove "SELECTED" badge from info section if exists
                const existingBadge = card.querySelector('.selected-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
            });
            
            // Add selection to clicked card
            parentCard.classList.add('selected');
            
            // Replace button with "SELECTED" badge
            const serviceInfo = parentCard.querySelector('.service-info');
            this.remove();
            
            const selectedBadge = document.createElement('div');
            selectedBadge.className = 'selected-badge';
            selectedBadge.textContent = 'SELECTED';
            serviceInfo.appendChild(selectedBadge);
            
            // Enable the next button
            document.getElementById('nextBtn').disabled = false;
        });
    });
    
    // Enable clicking anywhere on the card to select it
    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the select button (already handled above)
            if (e.target.classList.contains('select-btn') || e.target.closest('.select-btn')) {
                return;
            }
            
            // Find the select button in this card
            const selectBtn = this.querySelector('.select-btn');
            if (selectBtn) {
                // Trigger the select button's click event
                selectBtn.click();
            } else if (!this.classList.contains('selected')) {
                // If card is already selected (no button), simulate selection
                
                // Remove selection from all cards
                serviceCards.forEach(otherCard => {
                    otherCard.classList.remove('selected');
                    
                    // Restore buttons for other cards
                    const info = otherCard.querySelector('.service-info');
                    const existingBadge = otherCard.querySelector('.selected-badge');
                    
                    if (existingBadge) {
                        existingBadge.remove();
                        
                        const newButton = document.createElement('button');
                        newButton.className = 'select-btn';
                        newButton.textContent = 'SELECT SERVICE';
                        info.appendChild(newButton);
                        
                        // Re-attach event listener to new button
                        newButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            const parentCard = this.closest('.service-card');
                            // Similar logic as above...
                            // (This is simplified - in production you might want to refactor this to avoid code duplication)
                        });
                    }
                });
                
                // Add selected class to this card
                this.classList.add('selected');
                
                // Enable next button
                document.getElementById('nextBtn').disabled = false;
            }
        });
    });

    // Event Listeners
    vehicleOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove 'selected' class from all options
            vehicleOptions.forEach(opt => opt.classList.remove('selected'));
            // Add 'selected' class to the clicked option
            this.classList.add('selected');
            // Enable next button when a vehicle is selected
            nextBtn.disabled = false;
        });
    });

    nextBtn.addEventListener('click', function() {
        // For step 1, check if a service is selected
        if (currentStep === 0) {
            const selectedService = document.querySelector('.service-card.selected');
            if (!selectedService) {
                alert('Please select a service type');
                return;
            }
        }
        
        // For step 2, check if a vehicle is selected
        if (currentStep === 1) {
            const selectedVehicle = document.querySelector('.vehicle-option.selected');
            if (!selectedVehicle) {
                alert('Please select a vehicle type');
                return;
            }
        }
        
        // Move to the next step
        if (currentStep < steps.length - 1) {
            // Hide current step
            steps[currentStep].classList.remove('active');
            // Show next step
            steps[currentStep + 1].classList.add('active');
            
            // Update progress indicators
            const circles = document.querySelectorAll('.step-circle');
            const lines = document.querySelectorAll('.line');
            
            // Update circle
            circles[currentStep + 1].classList.add('active');
            
            // Update line
            if (currentStep < lines.length) {
                lines[currentStep].classList.add('active');
            }
            
            currentStep++;
            updateButtons();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentStep > 0) {
            // Hide current step
            steps[currentStep].classList.remove('active');
            // Show previous step
            steps[currentStep - 1].classList.add('active');
            
            // Update progress indicators
            const circles = document.querySelectorAll('.step-circle');
            const lines = document.querySelectorAll('.line');
            
            // Update circle
            circles[currentStep].classList.remove('active');
            
            // Update line
            if (currentStep - 1 < lines.length) {
                lines[currentStep - 1].classList.remove('active');
            }
            
            currentStep--;
            updateButtons();
        }
    });

    // Functions
    function updateButtons() {
        // Hide back button on first step
        if (currentStep === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }

        // Change next button text on last step
        if (currentStep === steps.length - 1) {
            nextBtn.textContent = 'REQUEST QUOTE';
        } else {
            nextBtn.textContent = 'NEXT STEP';
        }

        // Disable next button initially (until selection is made)
        if (currentStep === 0) {
            const selectedVehicle = document.querySelector('.vehicle-option.selected');
            nextBtn.disabled = !selectedVehicle;
        }

        // Show/hide cancel button based on step
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.style.display = currentStep === 0 ? 'block' : 'none';
        }
    }

    // Responsive adjustments
    function handleResponsiveLayout() {
        const windowWidth = window.innerWidth;
        
        // Adjust top bar for mobile
        if (windowWidth < 768) {
            // Reorganize top bar elements if needed
            const topBar = document.querySelector('.top-bar .container');
            if (topBar && !topBar.classList.contains('flex-column')) {
                topBar.classList.add('flex-column');
            }
        } else {
            const topBar = document.querySelector('.top-bar .container');
            if (topBar && topBar.classList.contains('flex-column')) {
                topBar.classList.remove('flex-column');
            }
        }
    }

    // Initial call
    handleResponsiveLayout();
    
    // Resize event
    window.addEventListener('resize', handleResponsiveLayout);

    // Info tooltips (optional enhancement)
    const infoIcons = document.querySelectorAll('.info-icon');
    if (typeof bootstrap !== 'undefined') {
        infoIcons.forEach(icon => {
            new bootstrap.Tooltip(icon, {
                title: 'Vehicle specifications and details',
                placement: 'top'
            });
        });
    }

    // Vehicle info modal functionality
    const vehicleInfoModal = new bootstrap.Modal(document.getElementById('vehicleInfoModal'));

    const vehicleSpecs = {
        'small-van': {
            length: '2.5M',
            width: '1.5M',
            height: '1.4M',
            volume: '5M³',
            maxCapacity: '800kg',
            palletCapacity: '2'
        },
        'transit-van': {
            length: '3.5M',
            width: '1.7M',
            height: '1.8M',
            volume: '11M³',
            maxCapacity: '1200kg',
            palletCapacity: '3'
        },
        // Add specs for other vehicles...
    };

    infoIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const vehicleOption = this.closest('.vehicle-option');
            const vehicleType = vehicleOption.dataset.vehicle;
            const specs = vehicleSpecs[vehicleType];

            if (specs) {
                document.getElementById('internalLength').textContent = specs.length;
                document.getElementById('internalWidth').textContent = specs.width;
                document.getElementById('internalHeight').textContent = specs.height;
                document.getElementById('loadspaceVolume').textContent = specs.volume;
                document.getElementById('maxCapacity').textContent = specs.maxCapacity;
                document.getElementById('palletCapacity').textContent = specs.palletCapacity;
            }

            vehicleInfoModal.show();
        });
    });

    // Collapse functionality
    const collapseIcons = document.querySelectorAll('.collapse-icon');

    collapseIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Toggle the aria-expanded attribute
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Get the target collapse element
            const targetId = this.getAttribute('data-bs-target');
            const collapseElement = document.querySelector(targetId);
            
            // Toggle the collapse using Bootstrap's collapse API
            const bsCollapse = new bootstrap.Collapse(collapseElement, {
                toggle: true
            });
        });
    });

    // Initialize all collapse icons
    document.querySelectorAll('.collapse-icon').forEach(icon => {
        icon.setAttribute('aria-expanded', 'true');
    });

    // Handle collapse functionality
    const collapseButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');
    
    collapseButtons.forEach(button => {
        // Initialize collapse using Bootstrap
        const targetId = button.getAttribute('data-bs-target');
        const collapseElement = document.querySelector(targetId);
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
            toggle: false
        });

        // Add click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const isCurrentlyExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle the collapse
            if (isCurrentlyExpanded) {
                bsCollapse.hide();
            } else {
                bsCollapse.show();
            }
        });
    });
});