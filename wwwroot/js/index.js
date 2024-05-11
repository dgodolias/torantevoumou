// List of businesses
var businesses = ["Φυσιοθεραπευτήριο Παπακωσταντόπουλος", "Κουρείο TheBarbers", "Φαρμακείο Παπαδόπουλος", "Φούρνος Παπαδόπουλος"];

// Greek alphabet
var alphabet = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split('');

// Function to display businesses
function displayBusinesses(businessesToDisplay) {
    // Sort businesses
    businessesToDisplay.sort();

    // Group businesses by first letter
    var groupedBusinesses = businessesToDisplay.reduce(function(grouped, business) {
        var letter = business[0].toUpperCase();
        grouped[letter] = grouped[letter] || [];
        grouped[letter].push(business);
        return grouped;
    }, {});

    // Display businesses
    var businessDictionary = document.getElementById('businessDictionary');
    businessDictionary.innerHTML = '';
    for (var i = 0; i < alphabet.length; i++) {
        var letterDiv = document.createElement('div');
        letterDiv.style.borderBottom = '1px solid black';
        letterDiv.style.cursor = 'pointer'; // Change cursor to pointer
        letterDiv.innerHTML = '<h2>' + alphabet[i] + '</h2>';
        var businessList = document.createElement('ul');
        businessList.style.display = 'none';
        if (groupedBusinesses[alphabet[i]]) {
            for (var j = 0; j < groupedBusinesses[alphabet[i]].length; j++) {
                var businessListItem = document.createElement('li');
                businessListItem.textContent = groupedBusinesses[alphabet[i]][j];
                businessList.appendChild(businessListItem);
            }
        }
        letterDiv.appendChild(businessList);
        letterDiv.addEventListener('click', function() {
            displaySelectedBusinesses(this.querySelector('h2').textContent);
        });
        businessDictionary.appendChild(letterDiv);
    }
}

// Function to display businesses starting with the selected letter
function displaySelectedBusinesses(letter) {
    var selectedBusinesses = businesses.filter(function(business) {
        return business[0].toUpperCase() === letter;
    });
    selectedBusinesses.sort();
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    for (var i = 0; i < selectedBusinesses.length; i++) {
        var businessDiv = document.createElement('div');
        businessDiv.textContent = selectedBusinesses[i];
        resultsDiv.appendChild(businessDiv);
    }
}

// Custom function to convert Greek text to lowercase
function toLowerGreek(input) {
    var output = input.replace(/Ά/g, 'ά').replace(/Έ/g, 'έ').replace(/Ή/g, 'ή').replace(/Ί/g, 'ί')
        .replace(/Ό/g, 'ό').replace(/Ύ/g, 'ύ').replace(/Ώ/g, 'ώ').replace(/Ϊ/g, 'ϊ').replace(/Ϋ/g, 'ϋ')
        .replace(/Α/g, 'α').replace(/Β/g, 'β').replace(/Γ/g, 'γ').replace(/Δ/g, 'δ')
        .replace(/Ε/g, 'ε').replace(/Ζ/g, 'ζ').replace(/Η/g, 'η').replace(/Θ/g, 'θ')
        .replace(/Ι/g, 'ι').replace(/Κ/g, 'κ').replace(/Λ/g, 'λ').replace(/Μ/g, 'μ')
        .replace(/Ν/g, 'ν').replace(/Ξ/g, 'ξ').replace(/Ο/g, 'ο').replace(/Π/g, 'π')
        .replace(/Ρ/g, 'ρ').replace(/Σ/g, 'σ').replace(/Τ/g, 'τ').replace(/Υ/g, 'υ')
        .replace(/Φ/g, 'φ').replace(/Χ/g, 'χ').replace(/Ψ/g, 'ψ').replace(/Ω/g, 'ω');
    return output;
}

// Function to display filtered businesses
function displayFilteredBusinesses(businessesToDisplay) {
    // Sort businesses
    businessesToDisplay.sort();

    // Display businesses
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    for (var i = 0; i < businessesToDisplay.length; i++) {
        var businessDiv = document.createElement('div');
        businessDiv.textContent = businessesToDisplay[i];
        resultsDiv.appendChild(businessDiv);
    }
}

// Function to filter businesses
function filterBusinesses() {
    var searchBar = document.getElementById('searchBar');
    var searchQuery = toLowerGreek(searchBar.value);
    console.log("Search Query: ", searchQuery); // Log the search query
    var resultsDiv = document.getElementById('results');
    if (searchQuery === '') {
        // If search box is empty, clear the results
        resultsDiv.innerHTML = '';
    } else {
        var filteredBusinesses = businesses.filter(function(business) {
            return toLowerGreek(business).startsWith(searchQuery);
        });
        console.log("Filtered Businesses: ", filteredBusinesses); // Log the filtered businesses
        displayFilteredBusinesses(filteredBusinesses);
    }
}

// Get the search bar element
var searchBar = document.getElementById('searchBar');

// Add an input event listener
searchBar.addEventListener('input', filterBusinesses);

// Display businesses when the page loads
displayBusinesses(businesses);