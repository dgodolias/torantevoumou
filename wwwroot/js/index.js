document.addEventListener("DOMContentLoaded", function () {
    // Fetch the service names from the DOM
    const serviceNamesElement = document.getElementById('serviceNames');
    const serviceNames = JSON.parse(serviceNamesElement.getAttribute('data-services'));

    serviceNames.forEach(serviceName => {
        // Replace this with your actual logic to use the service names
        console.log(serviceName);
    });

    // Greek alphabet
    var alphabet = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split('');

    // Function to display serviceNames
    function displayserviceNames(serviceNamesToDisplay) {
        // Sort serviceNames
        serviceNamesToDisplay.sort();

        // Group serviceNames by first letter
        var groupedserviceNames = serviceNamesToDisplay.reduce(function (grouped, business) {
            var letter = business[0].toUpperCase();
            grouped[letter] = grouped[letter] || [];
            grouped[letter].push(business);
            return grouped;
        }, {});

        // Display serviceNames
        var businessDictionary = document.getElementById('businessDictionary');
        businessDictionary.innerHTML = '';
        for (var i = 0; i < alphabet.length; i++) {
            var letterDiv = document.createElement('div');
            letterDiv.className = 'letterAlphIndex';
            letterDiv.style.cursor = 'pointer'; // Change cursor to pointer
            letterDiv.innerHTML = '<h2>' + alphabet[i] + '</h2>';
            var businessList = document.createElement('ul');
            businessList.style.display = 'none';
            if (groupedserviceNames[alphabet[i]]) {
                for (var j = 0; j < groupedserviceNames[alphabet[i]].length; j++) {
                    var businessListItem = document.createElement('li');
                    businessListItem.textContent = groupedserviceNames[alphabet[i]][j];
                    businessList.appendChild(businessListItem);
                }
            }
            letterDiv.appendChild(businessList);
            letterDiv.addEventListener('click', function () {
                displaySelectedserviceNames(this.querySelector('h2').textContent);
            });
            businessDictionary.appendChild(letterDiv);
        }
    }

    // Function to display serviceNames starting with the selected letter
    function displaySelectedserviceNames(letter) {
        var selectedserviceNames = serviceNames.filter(function (business) {
            return business[0].toUpperCase() === letter;
        });
        selectedserviceNames.sort();
        var resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        for (var i = 0; i < selectedserviceNames.length; i++) {
            var businessDiv = document.createElement('div');
            businessDiv.style.cursor = 'pointer'; // Change cursor to pointer
            businessDiv.textContent = selectedserviceNames[i];
            businessDiv.className = 'businessAlphIndex'; // Add class
            businessDiv.style.textAlign = 'left'; // Align text to the left
            resultsDiv.appendChild(businessDiv);
        }
    }

    // Function to display filtered serviceNames
    function displayFilteredserviceNames(serviceNamesToDisplay) {
        // Sort serviceNames
        serviceNamesToDisplay.sort();

        // Display serviceNames
        var resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        for (var i = 0; i < serviceNamesToDisplay.length; i++) {
            var businessDiv = document.createElement('div');
            businessDiv.textContent = serviceNamesToDisplay[i];
            businessDiv.className = 'letterAlphIndex'; // Add class
            businessDiv.style.textAlign = 'left'; // Align text to the left
            resultsDiv.appendChild(businessDiv);
        }
    }

    // Custom function to convert Greek text to lowercase and remove accents
    function toLowerGreek(input) {
        var output = input.replace(/Ά/g, 'α').replace(/Έ/g, 'ε').replace(/Ή/g, 'η').replace(/Ί/g, 'ι')
            .replace(/Ό/g, 'ο').replace(/Ύ/g, 'υ').replace(/Ώ/g, 'ω').replace(/Ϊ/g, 'ι').replace(/Ϋ/g, 'υ')
            .replace(/Α/g, 'α').replace(/Β/g, 'β').replace(/Γ/g, 'γ').replace(/Δ/g, 'δ')
            .replace(/Ε/g, 'ε').replace(/Ζ/g, 'ζ').replace(/Η/g, 'η').replace(/Θ/g, 'θ')
            .replace(/Ι/g, 'ι').replace(/Κ/g, 'κ').replace(/Λ/g, 'λ').replace(/Μ/g, 'μ')
            .replace(/Ν/g, 'ν').replace(/Ξ/g, 'ξ').replace(/Ο/g, 'ο').replace(/Π/g, 'π')
            .replace(/Ρ/g, 'ρ').replace(/Σ/g, 'σ').replace(/Τ/g, 'τ').replace(/Υ/g, 'υ')
            .replace(/Φ/g, 'φ').replace(/Χ/g, 'χ').replace(/Ψ/g, 'ψ').replace(/Ω/g, 'ω')
            .replace(/ά/g, 'α').replace(/έ/g, 'ε').replace(/ή/g, 'η').replace(/ί/g, 'ι')
            .replace(/ό/g, 'ο').replace(/ύ/g, 'υ').replace(/ώ/g, 'ω').replace(/ϊ/g, 'ι').replace(/ϋ/g, 'υ');
        return output;
    }



    // Function to filter serviceNames
    function filterserviceNames() {
        var searchBar = document.getElementById('searchBar');
        var searchQuery = toLowerGreek(searchBar.value);
        console.log("Search Query: ", searchQuery); // Log the search query
        var resultsDiv = document.getElementById('results');
        if (searchQuery === '') {
            // If search box is empty, clear the results
            resultsDiv.innerHTML = '';
        } else {
            var filteredserviceNames = serviceNames.filter(function (business) {
                return toLowerGreek(business).startsWith(searchQuery);
            });
            console.log("Filtered serviceNames: ", filteredserviceNames); // Log the filtered serviceNames
            displayFilteredserviceNames(filteredserviceNames);
        }
    }

    // Get the search bar element
    var searchBar = document.getElementById('searchBar');

    // Add an input event listener
    searchBar.addEventListener('input', filterserviceNames);

    // Display serviceNames when the page loads
    displayserviceNames(serviceNames);

});

