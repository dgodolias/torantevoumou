$("#changeEmail").click(function () {
    toggleReadonly("#email");
});

$("#changeFirstName").click(function () {
    toggleReadonly("#firstName");
});

$("#changeLastName").click(function () {
    toggleReadonly("#lastName");
});

$("#changeUsername").click(function () {
    toggleReadonly("#username");
});

$("#changePassword").click(function () {
    toggleReadonly("#password");
});

function toggleReadonly(selector) {
    var isReadonly = $(selector).prop("readonly");
    $(selector).prop("readonly", !isReadonly);
    $(selector).toggleClass("readonly", isReadonly);
}