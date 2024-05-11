// List of businesses
var businesses = ["Φυσιοθεραπευτήριο Παπακωσταντόπουλος", "Κουρείο TheBarbers", "Φαρμακείο Παπαδόπουλος", "Φούρνος Παπαδόπουλος"];

// Greek alphabet
var alphabet = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split('');

// Function to display businesses
function displayBusinesses() {
    // Sort businesses
    businesses.sort();

    // Group businesses by first letter
    var groupedBusinesses = businesses.reduce(function(grouped, business) {
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

// Function to filter businesses
function filterBusinesses() {
    var searchBar = document.getElementById('searchBar');
    var searchQuery = searchBar.value.toLowerCase();
    var filteredBusinesses = businesses.filter(function(business) {
        return business.toLowerCase().includes(searchQuery);
    });
    businesses = filteredBusinesses;
    displayBusinesses();
}

// Display businesses when the page loads
displayBusinesses();