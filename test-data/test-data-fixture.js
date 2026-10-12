const base = require('@playwright/test');

exports.customDDT = base.test.extend(
    {
        testDataForOrder:{
            "username":"rahulDanny@gmail.com",
            "password":"Iamking@00",
            "productName":"iphone 13 pro"
        }
    }
)