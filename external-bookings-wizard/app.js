// app.js for simulation-requote-app
document.addEventListener('DOMContentLoaded', () => {
    console.log("App initialized.");
});

function acceptQuotation() {
    // Hide Step 1
    const step1 = document.getElementById('step-1-body');
    if (step1) step1.classList.remove('open');

    // Show Step 2
    const step2 = document.getElementById('step-2-body');
    if (step2) step2.classList.add('open');

    // Open 2.1 Task UI
    const task21 = document.getElementById('task-2-1-content');
    if (task21) {
        task21.style.display = 'block';
    }

    // Render Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Smooth scroll
    setTimeout(() => {
        if (step2) step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function rejectQuotation() {
    // Hide Step 1
    const step1 = document.getElementById('step-1-body');
    if (step1) step1.classList.remove('open');

    // Show Step 2
    const step2 = document.getElementById('step-2-body');
    if (step2) step2.classList.add('open');

    // Close 2.1 Task UI just in case
    const task21 = document.getElementById('task-2-1-content');
    if (task21) {
        task21.style.display = 'none';
    }

    // Highlight and scroll to 2.4 Task
    const task24 = document.getElementById('task-2-4-container');
    const task24Row = document.getElementById('task-2-4-row');
    const task24Content = document.getElementById('task-2-4-content');

    if (task24 && task24Row && task24Content) {
        // Open the content block
        task24Content.style.display = 'block';
        if (window.lucide) {
            lucide.createIcons();
        }

        setTimeout(() => {
            task24.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Highlight effect on the container row
            task24Row.style.background = '#fff3e0'; // light orange background
            task24.style.border = '1px solid #fb8c00'; // orange border

            setTimeout(() => {
                task24Row.style.background = 'transparent';
                task24.style.border = '1px solid #eee';
            }, 2000);
        }, 100);
    }
}

function runSimulation1() {
    const steps = [
        document.getElementById('sim-step-1'),
        document.getElementById('sim-step-2'),
        document.getElementById('sim-step-3')
    ];

    // Guard against missing elements
    if (!steps[0]) return;

    // UX Update: Global Status
    const globalText = document.getElementById('sim-main-text');
    const globalIconContainer = document.getElementById('sim-main-icon-container');

    if (globalText && globalIconContainer) {
        globalText.innerHTML = 'Procesando conexión GDS...';
        globalText.className = 'signal-active';
        globalText.style.color = ''; // let class handle it

        globalIconContainer.innerHTML = '<i data-lucide="loader-2" id="sim-main-icon" class="icon-spin" style="color: #fb8c00; width: 18px;"></i>';
    }
    if (window.lucide) lucide.createIcons();

    // Reset styles
    steps.forEach(step => {
        step.style.opacity = '0.5';
        const icon = step.querySelector('.step-icon');
        icon.style.background = '#ccc';

        // Restore numbers if they have been defined
        if (icon.dataset.num) {
            icon.innerHTML = icon.dataset.num;
        } else {
            // Store original number
            icon.dataset.num = icon.innerHTML;
        }

        const status = step.querySelector('.step-status');
        if (status) status.style.display = 'none';
    });

    let delay = 500;

    // Read the sim result select box and hide the banner initially
    const simResult = document.getElementById('sim-result-select') ? document.getElementById('sim-result-select').value : 'ok';
    const koBanner = document.getElementById('sim-ko-banner');
    if (koBanner) koBanner.style.display = 'none';

    steps.forEach((step, index) => {
        setTimeout(() => {
            step.style.opacity = '1';
            const icon = step.querySelector('.step-icon');

            // For KO scenario, fail the last step
            if (simResult === 'ko' && index === steps.length - 1) {
                icon.style.background = '#f44336';
                icon.innerHTML = '<i data-lucide="x" style="width: 14px;"></i>';
            } else {
                icon.style.background = '#00a86b';
                icon.innerHTML = '<i data-lucide="check" style="width: 14px;"></i>';
            }

            const status = step.querySelector('.step-status');
            if (status) {
                status.style.display = 'block';
                if (simResult === 'ko' && index === steps.length - 1) {
                    status.innerHTML = 'Error en la validación';
                    status.style.color = '#f44336';
                } else {
                    if (index === 0) status.innerHTML = 'Completado correctamente';
                    if (index === 1) status.innerHTML = 'Cotización vigente y validada';
                    if (index === 2) status.innerHTML = 'Medio de pago confirmado';
                    status.style.color = '#888';
                }
            }

            if (window.lucide) {
                lucide.createIcons();
            }

            // Finish global status on last step
            if (index === steps.length - 1) {
                if (simResult === 'ok') {
                    if (globalText && globalIconContainer) {
                        globalText.innerHTML = 'Registro validado correctamente';
                        globalText.className = '';
                        globalText.style.color = '#00a86b';
                        globalText.style.fontWeight = '600';

                        globalIconContainer.innerHTML = '<i data-lucide="check-circle-2" id="sim-main-icon" style="color: #00a86b; width: 18px;"></i>';
                    }
                    if (window.lucide) lucide.createIcons();

                    // Advance to step 2 automatically for OK scenario
                    setTimeout(() => {
                        if (typeof acceptQuotation === 'function') acceptQuotation();
                    }, 1200);

                } else {
                    // KO Scenario
                    if (globalText && globalIconContainer) {
                        globalText.innerHTML = 'Error en el alta de la reserva';
                        globalText.className = '';
                        globalText.style.color = '#f44336';
                        globalText.style.fontWeight = '600';

                        globalIconContainer.innerHTML = '<i data-lucide="x-circle" id="sim-main-icon" style="color: #f44336; width: 18px;"></i>';
                    }
                    if (window.lucide) lucide.createIcons();

                    if (koBanner) {
                        koBanner.style.display = 'block';
                    }
                }
            }

        }, delay);
        delay += 1200; // wait 1.2s before next step
    });
}

function updateOfficeId() {
    const gdsSelect = document.getElementById('gds-select');
    const officeDisplay = document.getElementById('office-id-display');
    if (!gdsSelect || !officeDisplay) return;

    const gds = gdsSelect.value;
    switch (gds) {
        case 'amadeus':
            officeDisplay.value = 'TCILO3002';
            break;
        case 'sabre':
            officeDisplay.value = '9XTG';
            break;
        case 'galileo':
            officeDisplay.value = '53E6';
            break;
        default:
            officeDisplay.value = '';
    }
}

function processTramitacion() {
    const decisionInputs = document.getElementsByName('tramitacion_decision');
    let decision = 'accept';
    for (const input of decisionInputs) {
        if (input.checked) {
            decision = input.value;
            break;
        }
    }

    if (decision === 'reject') {
        // Find the main container holding the accordions
        const accordions = document.querySelectorAll('.accordion-item');
        if (accordions.length > 0) {
            const parent = accordions[0].parentElement;
            parent.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; background: white; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                    <i data-lucide="x-circle" style="width: 72px; height: 72px; color: #f44336; margin-bottom: 20px;"></i>
                    <h2 style="color: #333; margin-bottom: 10px;">Gestión Cancelada</h2>
                    <p style="color: #666; font-size: 16px;">Has rechazado la validación del registro. El asistente de reserva externa se ha cerrado.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
        }
    } else {
        // Accept decision - move to step 3
        const step2Body = document.getElementById('step-2-body');
        const step3Body = document.getElementById('step-3-body');

        if (step2Body) step2Body.classList.remove('open');
        if (step3Body) {
            step3Body.classList.add('open');
            step3Body.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function closeWizard() {
    const accordions = document.querySelectorAll('.accordion-item');
    if (accordions.length > 0) {
        const parent = accordions[0].parentElement;
        parent.innerHTML = `
            <div style="padding: 60px 20px; text-align: center; background: white; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <i data-lucide="x-circle" style="width: 72px; height: 72px; color: #f44336; margin-bottom: 20px;"></i>
                <h2 style="color: #333; margin-bottom: 10px;">Gestión Cancelada</h2>
                <p style="color: #666; font-size: 16px;">El asistente de reserva externa ha sido cerrado debido a un error en el registro.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    }
}

