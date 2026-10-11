class DashboardPage{

    constructor(page){
        this.page = page
        this.products = page.locator(".card-body");
        this.productsTitle = page.locator(".card-body b");
        this.cart = page.locator("button[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
    }

    async addProductToCart(productName){
            
        const titles = await this.productsTitle.allTextContents(); //POM
        console.log(titles);
        
        await this.productsTitle.first().waitFor();
        const count = await this.products.count();
        for(let i = 0; i<count; ++i){
            const title = await this.products.nth(i).locator("b").textContent();
            console.log(title)
            if (title === productName){
                //add to cart
                console.log('Clicking on add to cart')
                await this.products.nth(i).locator("text= Add To Cart").click(); // to find based on exacct text matching 
                break;
            }
        }
    }

    async navigateToCartPage(){
        await this.cart.click();
    }

    async navigateToOrders()
    {
        await this.orders.click();
    }
}

module.exports={
    DashboardPage
}