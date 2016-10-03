
const utils = (() => {
    let alertTemplate = $($('#alert-template').text());
    let root = $('#content');

    function showMsg(msg, type, cssClass, delay) {
        let container = alertTemplate.clone(true)
            .addClass(cssClass).text(`${type}: ${msg}`)
            .appendTo(root);

        setTimeout(() => {
            container.remove();
        }, delay || 5000)
    }

    return{
        showMsg
    }
})();

export { utils }