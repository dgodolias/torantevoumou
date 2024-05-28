// Add another event listener for the 'load' event
window.addEventListener('load', function() {
    const body = document.querySelector('body'),
        sidebar = body.querySelector('nav'),
        toggle = body.querySelector(".toggle"),
        searchBtn = body.querySelector(".search-box"),
        modeSwitch = body.querySelector(".toggle-switch"),
        modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click" , () => {
        sidebar.classList.toggle("close");
    })

    searchBtn.addEventListener("click" , () => {
        sidebar.classList.remove("close");
    })

    modeSwitch.addEventListener("click" , () => {
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light mode";
        }else{
            modeText.innerText = "Dark mode";
        }
    });

    // Embedding the appointments view in the dashboard view
    $(document).ready(function () {
        var userId = "-NyMlxGFeUF0SefsPcbz"; // Fetch the userId from the session storage
        //var userId = sessionStorage.getItem('UserId'); // Fetch the userId from the session storage
        console.log('User ID: ', userId);

        $('#appointmentLink').click(function (e) {
            e.preventDefault();
            $('#container').load('/appointments?userId=' + userId);
        });

        $("#profileLink").click(function (e) {
            e.preventDefault();
            $("#container").load("/profile?userId=" + userId);
        });
    });
});