document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const vehicleOptions = document.querySelectorAll('.vehicle-option');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const steps = document.querySelectorAll('.form-step');
    const serviceCards = document.querySelectorAll('.service-card');
    const selectButtons = document.querySelectorAll('.select-btn');
    const collectionContainer = document.getElementById('collectionContainer');
    const deliveryContainer = document.getElementById('deliveryContainer');
    let currentStep = 0;
    let collectionCounter = document.querySelectorAll('#collectionContainer .collection-form').length;
    let deliveryCounter = document.querySelectorAll('#deliveryContainer .collection-form').length;

    // Initialize Bootstrap components
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus'
        });
    });

    // Initialize Sortable for drag and drop
    if (collectionContainer) {
        new Sortable(collectionContainer, {
            handle: '.drag-handle',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onStart: function(evt) {
                evt.item.classList.add('dragging');
            },
            onEnd: function(evt) {
                evt.item.classList.remove('dragging');
            }
        });
    }

    if (deliveryContainer) {
        new Sortable(deliveryContainer, {
            handle: '.drag-handle',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onStart: function(evt) {
                evt.item.classList.add('dragging');
            },
            onEnd: function(evt) {
                evt.item.classList.remove('dragging');
            }
        });
    }

    // Collapse functionality
    function setupCollapse() {
        document.querySelectorAll('.collapse-icon').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-bs-target');
                const target = document.querySelector(targetId);
                
                if (!target) return;

                // Update aria-expanded attribute
                const isCurrentlyExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isCurrentlyExpanded);

                // Toggle collapse using Bootstrap's collapse method
                bootstrap.Collapse.getOrCreateInstance(target).toggle();
                
                // Toggle the icon based on the new expanded state
                const icon = this.querySelector('i');
                if (icon) {
                    if (isCurrentlyExpanded) {
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-up');
                    } else {
                        icon.classList.remove('bi-chevron-up');
                        icon.classList.add('bi-chevron-down');
                    }
                }
            });

            // Set initial icon state
            const targetId = button.getAttribute('data-bs-target');
            const target = document.querySelector(targetId);
            if (target) {
                const isExpanded = target.classList.contains('show');
                button.setAttribute('aria-expanded', isExpanded);
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove(isExpanded ? 'bi-chevron-up' : 'bi-chevron-down');
                    icon.classList.add(isExpanded ? 'bi-chevron-down' : 'bi-chevron-up');
                }
            }
        });

        // Initialize all collapse elements and add event listeners
        document.querySelectorAll('.collapse').forEach(collapseEl => {
            // Initialize with Bootstrap collapse
            bootstrap.Collapse.getOrCreateInstance(collapseEl);
            
            // Add event listeners for collapse events
            collapseEl.addEventListener('show.bs.collapse', function() {
                const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
                if (button) {
                    button.setAttribute('aria-expanded', 'true');
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.classList.remove('bi-chevron-up');
                        icon.classList.add('bi-chevron-down');
                    }
                }
            });

            collapseEl.addEventListener('hide.bs.collapse', function() {
                const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
                if (button) {
                    button.setAttribute('aria-expanded', 'false');
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-up');
                    }
                }
            });
        });
    }

    // Initialize vehicle info modal
    const vehicleInfoModal = new bootstrap.Modal(document.getElementById('vehicleInfoModal'));
    
    // Vehicle specifications data
    const vehicleSpecs = {
        'small-van': {
            name: 'Small Van',
            specs: {
                'Internal Length': '1.83M',
                'Internal Width': '1.54M',
                'Internal Height': '1.26M',
                'Loadspace Volume': '3.55m³',
                'Maximum Carrying Capacity': '400kg',
                'Rear door height': '1.2M',
                'Pallet capacity': '1',
                'Width between wheel arches': '1.24M'
            }
        },
        'transit-van': {
            name: 'Transit Van',
            specs: {
                'Internal Length': '2.9M',
                'Internal Width': '1.78M',
                'Internal Height': '1.88M',
                'Loadspace Volume': '9.70m³',
                'Maximum Carrying Capacity': '1000kg',
                'Rear door height': '1.74M',
                'Pallet capacity': '2',
                'Width between wheel arches': '1.39m'
            }
        },
        'lwb-transit': {
            name: 'LWB Transit',
            specs: {
                'Internal Length': '3.4M',
                'Internal Width': '1.78M',
                'Width between wheel arches': '1.39m',
                'Internal Height': '1.88m',
                'Rear Door Height': '1.74M',
                'Loadspace Volume': '11.37m³',
                'Maximum Carrying Capacity': '1400kg',
                'Pallet Capacity (Standard/Euro)': '3'
            }
        },
        'xlwb-transit': {
            name: 'XLWB Transit',
            specs: {
                'Internal Length': '4.2M',
                'Internal Width': '1.78M',
                'Width between wheel arches': '1.39M',
                'Internal Height': '2M',
                'Rear Door Height': '1.88M',
                'Loadspace Volume': '14.9M³',
                'Maximum Carrying Capacity': '1100kg',
                'Pallet Capacity (Standard/Euro)': '4'
            }
        },
        'luton-van': {
            name: 'Luton Van',
            specs: {
                'Internal Length': '4M',
                'Internal Width': '2M',
                'Internal Height': '2M',
                'Rear Door Height': '1.9M',
                'Loadspace Volume': '16M³',
                'Maximum Carrying Capacity': '1100kg',
                'Pallet Capacity (Standard/Euro)': '6'
            }
        },
        '7.5t-lorry': {
            name: '7.5t Lorry',
            specs: {
                'Internal Length': '6M',
                'Internal Width': '2.4M',
                'Internal Height': '2.2M',
                'Loadspace Volume': '31M³',
                'Maximum Carrying Capacity': '2500kg',
                'Pallet Capacity (Standard)': '10',
                'Pallet Capacity (Euro)': '12'
            }
        },
        '18t-lorry': {
            name: '18t Lorry',
            specs: {
                'Internal Length': '7M',
                'Internal Width': '2.4M',
                'Internal Height': '2.5M',
                'Loadspace Volume': '42M³',
                'Maximum Carrying Capacity': '9000kg',
                'Pallet capacity (Standard/Euro)': '14'
            }
        },
        '26t-lorry': {
            name: '26t Lorry',
            specs: {
                'Internal Length': '8M',
                'Internal Width': '2.4M',
                'Internal Height': '2.5M',
                'Loadspace Volume': '48M³',
                'Maximum Carrying Capacity': '15,000kg',
                'Pallet capacity (Standard)': '16',
                'Pallet capacity (Euro)': '20'
            }
        },
        '13.6m-artic': {
            name: '13.6m (Artic)',
            specs: {
                'Internal Length': '13.6M',
                'Internal Width': '2.5M',
                'Internal Height': '2.6M',
                'Loadspace Volume': '88M³',
                'Maximum Carrying Capacity': '26,000kg',
                'Pallet capacity (Standard)': '26',
                'Pallet capacity (Euro)': '32'
            }
        }
    };

    // Function to update modal content with vehicle specifications
    function updateVehicleModal(vehicleType) {
        const vehicle = vehicleSpecs[vehicleType];
        if (!vehicle) return;

        const modalTitle = document.querySelector('#vehicleInfoModal .modal-title');
        const vehicleInfoSection = document.querySelector('#vehicleInfoModal .vehicle-info');
        
        // Clear existing info rows
        vehicleInfoSection.innerHTML = `
            <h3 class="section-title fw-semibold">Vehicle Information</h3>
            <hr class="section-divider mb-3">
        `;

        // Add new info rows
        Object.entries(vehicle.specs).forEach(([label, value]) => {
            const infoRow = document.createElement('div');
            infoRow.className = 'info-row';
            infoRow.innerHTML = `
                <span class="info-label">${label}</span>
                <span class="info-value">${value}</span>
            `;
            vehicleInfoSection.appendChild(infoRow);
        });
    }

    // Add click event listeners to info icons
    vehicleOptions.forEach(card => {
        const infoIcon = card.querySelector('.info-icon');
        const vehicleType = card.getAttribute('data-vehicle') || 
                          card.querySelector('.vehicle-name').textContent.trim().toLowerCase().replace(/\s+/g, '-');
        
        infoIcon.addEventListener('click', (e) => {
            e.preventDefault();
            updateVehicleModal(vehicleType);
            const modal = new bootstrap.Modal(document.getElementById('vehicleInfoModal'));
            modal.show();
        });
    });

    // Function to update delete buttons state
    function updateDeleteButtonsState(container) {
        const stops = container.querySelectorAll('.collection-form');
        stops.forEach(stop => {
            const deleteBtn = stop.querySelector('.icon-btn.delete');
            if (deleteBtn) {
                if (stops.length === 1) {
                    deleteBtn.classList.add('disabled');
                    deleteBtn.style.opacity = '0.5';
                    deleteBtn.style.cursor = 'not-allowed';
                } else {
                    deleteBtn.classList.remove('disabled');
                    deleteBtn.style.opacity = '1';
                    deleteBtn.style.cursor = 'pointer';
                }
            }
        });
    }

    // Setup form events (delete, move up/down)
    function setupFormEvents(form) {
        // Delete button
        const deleteBtn = form.querySelector('.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                const container = form.parentElement;
                const stops = container.querySelectorAll('.collection-form');
                
                // Only allow delete if there's more than one stop
                if (stops.length > 1) {
                    form.remove();
                    updateStopNumbers(container);
                    updateDeleteButtonsState(container);
                }
            });
        }
        
        // Move up button
        form.querySelector('.move-up')?.addEventListener('click', function() {
            const prev = form.previousElementSibling;
            if (prev) {
                form.parentNode.insertBefore(form, prev);
            }
        });
        
        // Move down button
        form.querySelector('.move-down')?.addEventListener('click', function() {
            const next = form.nextElementSibling;
            if (next) {
                form.parentNode.insertBefore(next, form);
            }
        });
    }

    // Add Collection/Delivery Point
    function setupAddPointButtons() {
        document.querySelectorAll('.add-point-btn').forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-add-type');
                const container = type === 'collection' ? collectionContainer : deliveryContainer;
                const counter = type === 'collection' ? ++collectionCounter : ++deliveryCounter;
                
                const formId = `${type}${counter}`;
                const newForm = document.createElement('div');
                newForm.className = 'card collection-form mb-3';
                newForm.setAttribute('data-form-type', type);
                
                newForm.innerHTML = `
                    <div class="card-header">
                        <div class="d-flex align-items-center w-100 mb-2">
                            <span class="drag-handle me-1">
                                <i class="bi bi-grip-vertical"></i>
                            </span>
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <small>Stop ${counter}:</small>
                                    <div>New ${type} point</div>
                                </div>
                                <button class="collapse-icon btn p-0" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse${formId}"
                                    aria-expanded="true">
                                    <i class="bi bi-chevron-up"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="collapse show" id="collapse${formId}">
                        <div class="card-body">
                            <div class="d-flex justify-content-end mb-3">
                                <div class="action-icons">
                                    <button class="icon-btn">
                                        <i class="bi bi-arrow-up"></i>
                                    </button>
                                    <button class="icon-btn">
                                        <i class="bi bi-arrow-down"></i>
                                    </button>
                                    <button class="icon-btn delete">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Country<span class="text-danger">*</span></label>
                                <select class="form-select" required>
                                    <option value="" selected>Select country</option>
                                    <option value="uk">United Kingdom</option>
                                    <option value="us">United States</option>
                                    <option value="ca">Canada</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">${type === 'collection' ? 'Collection' : 'Delivery'} Postcode<span class="text-danger">*</span></label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="collection-date" class="form-label">Date<span class="text-danger">*</span></label>
                                <input type="date" class="form-control" placeholder="Select date" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Ready At<span class="text-danger">*</span></label>
                                    <select class="form-select" required>
                                        <option value="" selected>Ready at</option>
                                        <option value="9:00">9:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Collect By<span class="text-danger">*</span></label>
                                    <select class="form-select" required>
                                        <option value="" selected>Collect by</option>
                                        <option value="15:00">3:00 PM</option>
                                        <option value="16:00">4:00 PM</option>
                                        <option value="17:00">5:00 PM</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox">
                                    <label class="form-check-label label-text">Helper</label>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                container.appendChild(newForm);
                
                // Initialize collapse for the new form
                const collapseElement = newForm.querySelector('.collapse');
                const collapseButton = newForm.querySelector('.collapse-icon');
                if (collapseElement && collapseButton) {
                    new bootstrap.Collapse(collapseElement);
                    collapseButton.addEventListener('click', function() {
                        const isCurrentlyExpanded = this.getAttribute('aria-expanded') === 'true';
                        this.setAttribute('aria-expanded', !isCurrentlyExpanded);
                        
                        const icon = this.querySelector('i');
                        if (icon) {
                            if (isCurrentlyExpanded) {
                                icon.classList.remove('bi-chevron-up');
                                icon.classList.add('bi-chevron-down');
                            } else {
                                icon.classList.remove('bi-chevron-down');
                                icon.classList.add('bi-chevron-up');
                            }
                        }
                    });
                }
                
                setupFormEvents(newForm);
                updateDeleteButtonsState(container);
            });
        });
    }

    // Service card selection
    function setupServiceCards() {
        serviceCards.forEach(card => {
            const selectBtn = card.querySelector('.select-btn');
            
            selectBtn?.addEventListener('click', function(e) {
                e.stopPropagation();
                selectService(card);
            });
            
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.select-btn')) {
                    selectService(card);
                }
            });
        });
    }

    function selectService(card) {
        // Remove selection from all cards
        serviceCards.forEach(c => {
            c.classList.remove('selected');
            const btn = c.querySelector('.select-btn');
            const badge = c.querySelector('.selected-badge');
            
            if (btn) btn.style.display = 'block';
            if (badge) badge.remove();
        });
        
        // Add selection to clicked card
        card.classList.add('selected');
        const btn = card.querySelector('.select-btn');
        const serviceInfo = card.querySelector('.service-info');
        
        if (btn) btn.style.display = 'none';
        
        if (serviceInfo) {
            const selectedBadge = document.createElement('div');
            selectedBadge.className = 'selected-badge';
            selectedBadge.textContent = 'SELECTED';
            serviceInfo.appendChild(selectedBadge);
        }
        
        // Enable next button if on first step
        if (currentStep === 0) {
            nextBtn.disabled = false;
        }
    }

    // Vehicle selection
    function setupVehicleSelection() {
        vehicleOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                if (e.target.closest('.info-icon')) return;
                
                vehicleOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Enable next button if on vehicle selection step
                if (currentStep === 1) {
                    nextBtn.disabled = false;
                }
            });
        });
    }

    // Form navigation
    function setupFormNavigation() {
        nextBtn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
        
        prevBtn.addEventListener('click', function() {
            goToStep(currentStep - 1);
        });
    }

    function validateStep(step) {
        // Get the selected service name
        const selectedService = document.querySelector('.service-card.selected');
        const serviceName = selectedService ? selectedService.querySelector('.service-name').textContent : '';

        switch(step) {
            case 0:
                if (!document.querySelector('.service-card.selected')) {
                    alert('Please select a service type');
                    return false;
                }
                return true;
            case 1:
                // Skip validation for step 2 if International On-Board Courier is selected
                if (serviceName === 'International On-Board Courier') {
                    return true;
                }
                if (!document.querySelector('.vehicle-option.selected') && 
                    serviceName !== 'UK & Ireland Pallet Service' && 
                    serviceName !== 'International Docs & Parcels' &&
                    serviceName !== 'International Freight') {
                    alert('Please select a vehicle type');
                    return false;
                }
                return true;
            case 2:
                if (collectionCounter === 0 || deliveryCounter === 0) {
                    alert('Please add at least one collection and one delivery point');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    function goToStep(step) {
        if (step < 0 || step >= steps.length) return;
        
        steps[currentStep].classList.remove('active');
        steps[step].classList.add('active');
        currentStep = step;
        
        updateProgressBar();
        updateButtons();
    }

    function updateProgressBar() {
        const circles = document.querySelectorAll('.step-circle');
        const lines = document.querySelectorAll('.line');
        
        circles.forEach((circle, index) => {
            circle.classList.toggle('active', index <= currentStep);
        });
        
        lines.forEach((line, index) => {
            line.classList.remove('active', 'half-active');
            if (index < currentStep) {
                line.classList.add('active');
            } else if (index === currentStep) {
                line.classList.add('half-active');
            }
        });
    }

    function updateButtons() {
        prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
        nextBtn.textContent = currentStep === steps.length - 1 ? 'REQUEST QUOTE' : 'NEXT STEP';
        
        // Show/hide cancel button based on step
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.style.display = currentStep === 0 ? 'block' : 'none';
        }

        // Add click handler for request quote button
        if (currentStep === steps.length - 1) {
            nextBtn.addEventListener('click', handleQuoteSubmission);
        } else {
            nextBtn.removeEventListener('click', handleQuoteSubmission);
        }
    }

    // Handle quote form submission
    function handleQuoteSubmission(e) {
        e.preventDefault();
        
        // Generate a random quote reference
        const quoteRef = 'Q' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // Hide the form container
        document.querySelector('.multi-step-form').style.display = 'none';
        
        // Update quote reference and show success page
        document.getElementById('quoteReference').textContent = quoteRef;
        document.getElementById('successPage').style.display = 'block';
    }

    // Function to request another quote
    window.requestAnotherQuote = function() {
        // Reset form
        document.getElementById('quoteForm').reset();
        
        // Hide success page and show form
        document.getElementById('successPage').style.display = 'none';
        document.querySelector('.multi-step-form').style.display = 'block';
        
        // Reset to first step
        goToStep(0);
    };

    // Function to go to homepage
    window.goToHomepage = function() {
        window.location.href = '/';
    };

    // Email validation
    const emailInput = document.getElementById('email');
    const emailCheck = document.getElementById('email-check');

    emailInput.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            emailCheck.classList.remove('d-none');
        } else {
            emailCheck.classList.add('d-none');
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('contact-number');
    const countryCode = document.getElementById('country-code');

    phoneInput.addEventListener('input', function(e) {
        // Remove all non-digit characters
        let value = this.value.replace(/\D/g, '');
        
        // Format the number
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        this.value = value;
    });

    // Function to handle stop reordering
    function setupStopReordering() {
        document.addEventListener('click', function(e) {
            const button = e.target.closest('.icon-btn');
            if (!button) return;

            const isUpButton = button.querySelector('.bi-arrow-up');
            const isDownButton = button.querySelector('.bi-arrow-down');
            if (!isUpButton && !isDownButton) return;

            const stopCard = button.closest('.collection-form');
            if (!stopCard) return;

            const container = stopCard.parentElement;
            const stops = Array.from(container.children);
            const currentIndex = stops.indexOf(stopCard);

            if (isUpButton && currentIndex > 0) {
                // Move up
                container.insertBefore(stopCard, stops[currentIndex - 1]);
                updateStopNumbers(container);
            } else if (isDownButton && currentIndex < stops.length - 1) {
                // Move down
                container.insertBefore(stopCard, stops[currentIndex + 2]);
                updateStopNumbers(container);
            }
        });
    }

    // Function to update stop numbers after reordering
    function updateStopNumbers(container) {
        const stops = container.querySelectorAll('.collection-form');
        stops.forEach((stop, index) => {
            const stopNumberEl = stop.querySelector('small');
            if (stopNumberEl) {
                stopNumberEl.textContent = `Stop ${index + 1}:`;
            }
        });
    }

    // Initialize stop reordering
    setupStopReordering();

    // Initialize all functionality
    function init() {
        setupCollapse();
        setupAddPointButtons();
        setupServiceCards();
        setupVehicleSelection();
        setupFormNavigation();
        
        // Setup events for existing forms
        document.querySelectorAll('.collection-form').forEach(setupFormEvents);
        
        // Initialize delete button states for existing containers
        if (collectionContainer) updateDeleteButtonsState(collectionContainer);
        if (deliveryContainer) updateDeleteButtonsState(deliveryContainer);
        
        // Initialize first step
        updateButtons();
        updateProgressBar();
    }

    init();

    // Service selection handling
    const vehicleSelectionForm = document.getElementById('vehicleSelectionForm');
    const palletServiceForm = document.getElementById('palletServiceForm');
    const docsParcelForm = document.getElementById('docsParcelForm');
    const freightForm = document.getElementById('freightForm');

    // Handle service selection
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            serviceCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');

            // Get the service name
            const serviceName = this.querySelector('.service-name').textContent;

            // Hide all forms first
            vehicleSelectionForm.style.display = 'none';
            palletServiceForm.style.display = 'none';
            docsParcelForm.style.display = 'none';
            freightForm.style.display = 'none';

            // Enable the next button
            const nextBtn = document.getElementById('nextBtn');
            nextBtn.disabled = false;

            // For On-Board Courier, modify the next button to skip step 2
            if (serviceName === 'International On-Board Courier') {
                nextBtn.addEventListener('click', function onBoardNextClick(e) {
                    e.preventDefault();
                    // Remove this specific click handler after it's used
                    nextBtn.removeEventListener('click', onBoardNextClick);
                    // Go directly to step 3
                    goToStep(2);
                }, { once: true }); // Use once:true to ensure the listener is removed after first use
            } else {
                // Show appropriate form in step 2
                if (serviceName === 'UK/EUROPE Time-Critical Courier') {
                    vehicleSelectionForm.style.display = 'block';
                    // Show all vehicles
                    document.querySelectorAll('.vehicle-option').forEach(vehicle => {
                        vehicle.style.display = 'block';
                    });
                } else if (serviceName === 'UK & Ireland Pallet Service') {
                    palletServiceForm.style.display = 'block';
                } else if (serviceName === 'UK Non-Standard Economy') {
                    vehicleSelectionForm.style.display = 'block';
                    
                    // Get all vehicle options
                    const vehicles = document.querySelectorAll('.vehicle-option');
                    
                    // Hide all vehicles first
                    vehicles.forEach(vehicle => {
                        vehicle.style.display = 'none';
                    });
                    
                    // Show only specific vehicles
                    vehicles.forEach(vehicle => {
                        const vehicleName = vehicle.querySelector('.vehicle-name').textContent.trim();
                        if (['Small Van', 'Transit Van', 'LWB Transit', 'XLWB Transit'].includes(vehicleName)) {
                            vehicle.style.display = 'block';
                        }
                    });
                } else if (serviceName === 'International Docs & Parcels') {
                    docsParcelForm.style.display = 'block';
                } else if (serviceName === 'International Freight') {
                    freightForm.style.display = 'block';
                }
            }
        });
    });
});