$(document).ready(function () {
    console.log('DOM loaded');

    const alphabet = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const alphabetButtons = document.getElementById('alphabetButtons');
    const tableBody = document.querySelector('#services-table tbody');
    const refreshButton = document.getElementById('refresh-button');
    let ServicesInfo = null;

    // Async function to handle fetch call
    async function fetchServicesInfo() {
        try {
            const response = await fetch('https://us-central1-torantevoumou-86820.cloudfunctions.net/getServicesInfo');
            const data = await response.json();
            sessionStorage.setItem('ServicesInfo', JSON.stringify(data));
            console.log('ServicesInfo saved to sessionStorage:', data);
            ServicesInfo = data;
            console.log('ServicesInfo:', JSON.stringify(data));

            // After fetching data, create table rows
            const services = convertToServicesList(ServicesInfo);
            createTableRows(services);
        } catch (error) {
            console.error('Error fetching ServicesInfo:', error);
        }
    }

    // Call the async function after the page has fully loaded
    fetchServicesInfo();

    function createTableRows(filteredServices) {
        // Clear existing rows
        tableBody.innerHTML = '';

        filteredServices.forEach(service => {
            const row = document.createElement('tr');

            service.forEach((detail, index) => {
                const cell = document.createElement('td');
                if (index === 2) {
                    // Create a cell for operational hours with a toggle button
                    const toggleButton = document.createElement('button');
                    toggleButton.classList.add('toggle-button');

                    // Add an image for the arrow
                    const arrowImage = document.createElement('img');
                    arrowImage.src = 'img/arrow-down.png';
                    arrowImage.alt = 'Toggle';
                    arrowImage.classList.add('arrow-down');

                    toggleButton.appendChild(arrowImage);

                    // Create a div to hold the detailed hours
                    const detailsDiv = document.createElement('div');
                    detailsDiv.classList.add('details');
                    detailsDiv.style.display = 'none'; // Initially hidden

                    // Split the hours and create a list of details
                    const hoursArray = detail.split('#');
                    hoursArray.forEach(hour => {
                        const detailItem = document.createElement('div');
                        detailItem.textContent = hour;
                        detailsDiv.appendChild(detailItem);
                    });

                    // Add the toggle button and details div to the cell
                    cell.appendChild(toggleButton);
                    cell.appendChild(detailsDiv);

                    // Add click event listener to the toggle button
                    toggleButton.addEventListener('click', () => {
                        if (detailsDiv.style.display === 'none') {
                            detailsDiv.style.display = 'block';
                            arrowImage.classList.remove('arrow-down');
                            arrowImage.classList.add('arrow-up');
                        } else {
                            detailsDiv.style.display = 'none';
                            arrowImage.classList.remove('arrow-up');
                            arrowImage.classList.add('arrow-down');
                        }
                    });
                } else if (index === 3) {
                    // Create a button for the "Κλεισε ραντεβού" column
                    const appointmentButton = document.createElement('button');
                    appointmentButton.id = 'site-redirect'; // Set the id of the button

                    // Create a div, add class, and then create an image for the arrow icon
                    const div = document.createElement('div');
                    div.classList.add('button_top'); // Add class to div

                    const arrowIcon = document.createElement('img');
                    arrowIcon.src = 'img/tick.png'; // Path to your arrow right icon image
                    arrowIcon.alt = 'Book Appointment';

                    // Append the image to the div, and the div to the button
                    div.appendChild(arrowIcon);
                    appointmentButton.appendChild(div);

                    // Add click event listener to the appointment button
                    appointmentButton.addEventListener('click', () => {
                        const serviceName = service[0];
                        const serviceDetails = ServicesInfo[serviceName];
                        if (serviceDetails && serviceDetails.website) {
                            window.location.href = `/services${serviceDetails.website}`;
                        }
                    });

                    // Append the button to the cell
                    cell.appendChild(appointmentButton);
                } else {
                    cell.textContent = detail;
                }
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }

    alphabet.forEach(letter => {
        const button = document.createElement('button');
        const buttonTop = document.createElement('div');
        buttonTop.className = 'button_top';
        buttonTop.innerText = letter;
        button.appendChild(buttonTop);
        alphabetButtons.appendChild(button);

        // Add event listener to filter services by letter
        button.addEventListener('click', () => {
            const services = convertToServicesList(ServicesInfo);
            const filteredServices = services.filter(service => {
                const serviceNameWords = service[0].split(' ');
                return serviceNameWords.some(word => word.startsWith(letter));
            });
            createTableRows(filteredServices);
        });
    });

    // Add event listener to the refresh button to refresh the table and add the rotate animation
    refreshButton.addEventListener('click', () => {
        // Trigger the rotate animation
        refreshButton.classList.add('rotate');

        // Remove the rotate class after the animation ends to allow re-triggering
        refreshButton.addEventListener('animationend', () => {
            refreshButton.classList.remove('rotate');
        }, { once: true });

        // Refresh the table (show all services)
        const services = convertToServicesList(ServicesInfo);
        createTableRows(services);
    });
});

function convertToServicesList(data) {
    const services = [];
    const daysOfWeek = ["ΔΕΥΤΕΡΑ", "ΤΡΙΤΗ", "ΤΕΤΑΡΤΗ", "ΠΕΜΠΤΗ", "ΠΑΡΑΣΚΕΥΗ", "ΣΑΒΒΑΤΟ", "ΚΥΡΙΑΚΗ"];

    for (const [name, details] of Object.entries(data)) {
        const hours = details.hours.split('(').slice(1).map((day, index) => {
            const [time] = day.split(')');
            return time ? `${daysOfWeek[index]}: ${time.trim().replace(/#/g, ' & ')}` : `${daysOfWeek[index]}: -`;
        }).join('#');
        services.push([name, details.location, hours, details.website]);
    }
    return services;
}
