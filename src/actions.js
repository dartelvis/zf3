
export const messageActions = {
    showNotify: function(msg) {
        return {
            type: 'NOTIFY',
            data: {
                msg: msg
            }
        };
    },
    showError: function(title, msg) {
        return {
            type: 'MESSAGE',
            data: {
                open: true,
                content: msg,
                title: title
            }
        };
    },
    showConfirm: function(title, msg, confirm) {
        return {
            type: 'MESSAGE',
            data: {
                open: true,
                content: msg,
                title: title,
                confirm: confirm
            }
        };
    }
};
