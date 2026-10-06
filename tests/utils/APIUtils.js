class APIUtils{

    constructor(apiContext, loginPayload){
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken(){
        const loginRes = await this.apiContext.post(    
            "https://rahulshettyacademy.com/api/ecom/auth/login",{
                data:this.loginPayload
            }
        )
        const loginResJSON = await loginRes.json();
        const token = loginResJSON.token;
        return token
    }

    async createOrder(orderPayload){
        let response = {};
        response.token = await this.getToken();
        const orderRes = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{
                data: orderPayload,
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':response.token
                }
            })
            const orderResJSON = await orderRes.json();
            const orderID = orderResJSON.orders[0];
            response.orderID = orderID
            return response;
    }
    
}

module.exports = {APIUtils};