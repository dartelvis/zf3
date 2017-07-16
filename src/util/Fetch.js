
function checkResponse(response) {
    if (response.status === 500) {
        return false;
    }
    if (response.status === 404) {
        console.log('Página não encontrada');
        return false;
    }
    if (response.status === 403) {
        response.text().then((text) => {
            console.log(text || 'A sessão expirou');
        });
        // document.location.reload();
        return false;
    }
    return true;
}

function request(args)
{
    if (args[0] instanceof window.Request) {
        return args[0];
    }

    var options = args[1] || {}
    options.headers = options.headers || {}
    options.headers['X-Requested-With'] = 'XMLHttpRequest';
    options.credentials = options.credentials || 'include';
    return new Request(args[0], options);
}

var Fetch = {
    getJson: function(...args) {
        NProgress.start();
        NProgress.set(0.4);
        return new Promise(function(resolve, reject) {
            fetch.call(null, request(args))
                .then((response) => {
                    if (!checkResponse(response)) {
                        throw new Error(`Código de resposta inválido: ${response.status}`);
                    }
                    return response.json();
                })
                .then((json) => {
                    NProgress.done();
                    resolve(json);
                })
                .catch((e) => {
                    console.log("Fetch error", e);
                    NProgress.done();
                    reject(e);
                });
        });
    },
    getText: function(...args) {
        NProgress.start();
        NProgress.set(0.4);
        return new Promise(function(resolve, reject) {
            fetch.call(null, request(args))
                .then((response) => {
                    if (!checkResponse(response)) {
                        throw new Error(`Código de resposta inválido: ${response.status}`);
                    }
                    return response.text();
                })
                .then((json) => {
                    NProgress.done();
                    resolve(json);
                })
                .catch((e) => {
                    console.log("Fetch error", e);
                    NProgress.done();
                    reject(e);
                });
        });
    }
}

export default Fetch;
