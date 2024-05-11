// List of businesses
var businesses = ["Φυσιοθεραπευτήριο Παπακωσταντόπουλος", "Κουρείο TheBarbers"];

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
    businessDictionary.style.border = '1px solid black';
    businessDictionary.style.padding = '10px';
    businessDictionary.style.width = '200px';
    businessDictionary.style.columnCount = '2';
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
            var businessList = this.querySelector('ul');
            businessList.style.display = businessList.style.display === 'none' ? 'block' : 'none';
        });
        businessDictionary.appendChild(letterDiv);
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

// Create a parent container
var parentContainer = document.createElement('div');
parentContainer.style.display = 'flex';

// Get the businessDictionary and append it to the parent container
var businessDictionary = document.getElementById('businessDictionary');
parentContainer.appendChild(businessDictionary);

// Create a new box for the search bar
var searchBarContainer = document.createElement('div');
searchBarContainer.style.border = '1px solid black';
searchBarContainer.style.padding = '10px';
searchBarContainer.style.flexGrow = '1'; // This will make the searchBarContainer take up the remaining space
searchBarContainer.style.display = 'flex';
searchBarContainer.style.flexDirection = 'column';
searchBarContainer.style.alignItems = 'center';

// Create a container for the title and the search bar
var titleSearchBarContainer = document.createElement('div');
titleSearchBarContainer.style.display = 'flex';
titleSearchBarContainer.style.justifyContent = 'center'; // This will distribute the available space around the items
titleSearchBarContainer.style.width = '100%';

// Create a title
var title = document.createElement('h2');
title.id = 'alphindex'; // Add an id to the title
title.textContent = 'Οι υπηρεσίες μας';
title.style.marginRight = '0px'; // Remove the margin to the right of the title
title.style.marginBottom = '0px'; // Remove the margin to the bottom of the title

// Create a spacer element
var spacer = document.createElement('div');
spacer.style.width = '30px'; // Set the width of the spacer to 30px

// Move the search bar to the new box
var searchBar = document.getElementById('searchBar');

// Add the title, spacer and search bar to the titleSearchBarContainer
titleSearchBarContainer.appendChild(title);
titleSearchBarContainer.appendChild(spacer);
titleSearchBarContainer.appendChild(searchBar);

// Create a separation line
var line = document.createElement('hr');
line.style.width = '50%';
line.style.borderTop = '1px solid black';
line.style.alignSelf = 'center';

// Add the titleSearchBarContainer and line to the searchBarContainer
searchBarContainer.appendChild(titleSearchBarContainer);
searchBarContainer.appendChild(line);

// Add the new box to the parent container
parentContainer.appendChild(searchBarContainer);

// Add the parent container to the container
var container = document.querySelector('#services .container');
container.appendChild(parentContainer);