import AccessTokenStore from "../store/AccessTokenStore";

const getHeader = () => {
    const token = AccessTokenStore.instance.getAccessToken();
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
};

export default class ApiRequest {
    
    static putMethodApiCall = (url, body, callback) => {
        fetch(url, {
            method: "PUT",
            headers: getHeader(),
            body: body
        }).then((response) => response.json())
            .then((responseJson) => {
                return callback(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    static putMethodApiCallWIthoutBody = (url, callback) => {
        fetch(url, {
            method: "PUT",
            headers: getHeader()
        }).then((response) => response.json())
            .then((responseJson) => {
                return callback(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    static postMethodApiCall = (url, body, callback) => {
        fetch(url, {
            method: "POST",
            headers: getHeader(),
            body: body

        }).then((response) => response.json())
            .then((responseJson) => {
                return callback(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    static getMethodApiCall = (url, callback) => {
        fetch(url, {
            method: "GET",
            headers: getHeader()
        }).then((response) => response.json())
            .then((responseJson) => {
                return callback(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    static deleteMethodApiCall = (url, callback) => {
        fetch(url, {
            method: "DELETE",
            headers: getHeader()
        }).then((response) => response.json())
            .then((responseJson) => {
                return callback(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    static postMethodApiCall = (url, callback) => {
        fetch(url, {
            method : "POST",
            headers : getHeader()
        }).then((response) => response.json())
        .then((responseJson) => {
            return callback(responseJson)
        }).catch((error) => {
            console.log(error);
        })
    }
}
