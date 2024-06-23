document.addEventListener('DOMContentLoaded', () => {
    const alphabet = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const alphabetButtons = document.getElementById('alphabetButtons');
    const tableBody = document.querySelector('#services-table tbody');
    const refreshButton = document.getElementById('refresh-button');
    ServicesInfo = null;

    // Async function to handle fetch call
    async function fetchServicesInfo() {
        try {
            const response = await fetch('https://us-central1-torantevoumou-86820.cloudfunctions.net/getServicesInfo');
            const data = await response.json();
            sessionStorage.setItem('ServicesInfo', JSON.stringify(data));
            console.log('ServicesInfo saved to sessionStorage:', data);
            ServicesInfo = data;
        } catch (error) {
            console.error('Error fetching ServicesInfo:', error);
        }
    }

    // Call the async function after the page has fully loaded
    fetchServicesInfo();

    const data = JSON.parse(sessionStorage.getItem('ServicesInfo')) || ServicesInfo;

    const services = convertToServicesList(data);

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
                } else {
                    cell.textContent = detail;
                }
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }

    // Initially display all services
    createTableRows(services);

    alphabet.forEach(letter => {
        const button = document.createElement('button');
        const buttonTop = document.createElement('div');
        buttonTop.className = 'button_top';
        buttonTop.innerText = letter;
        button.appendChild(buttonTop);
        alphabetButtons.appendChild(button);

        // Add event listener to filter services by letter
        button.addEventListener('click', () => {
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
        services.push([name, details.location, hours]);
    }
    return services;
}
