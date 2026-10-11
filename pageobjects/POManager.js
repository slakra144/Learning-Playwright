const {LoginPage} = require("../pageobjects/LoginPage");
const {DashboardPage} = require("../pageobjects/DashboardPage");
const {CartPage} = require("../pageobjects/CartPage");
const {CheckoutPage} = require("../pageobjects/CheckoutPage");
const {OrdersHistoryPage} = require("../pageobjects/OrderHistoryPage");

class POManager{
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    }

    getLoginPage(){
        return this.loginPage;
    }

    getDashboardPage(){
        return this.dashboardPage;
    }

    getCartPage(){
        return this.cartPage;
    }

    getCheckoutPage(){
        return this.checkoutPage;
    }

    getOrdersHistoryPage(){
        return this.ordersHistoryPage;
    }
}

module.exports={
    POManager
}