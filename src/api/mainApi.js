import axios from "axios";

export const getGoldPriceApi = async () => {
    return await axios.get("https://api.chnwt.dev/thai-gold-api/latest?fbclid=IwY2xjawRcX7tleHRuA2FlbQIxMABicmlkETFnNGwyZzhJUE9sVU9UcVZ3c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHpC3CisF-_ohKxhC649xRYQsuXmZuUYwHLLiStpSx1BnroozhodiSVY9u2lU_aem_vWCpbrI0ZLPQ8MY07Az6VA")
}

// export const getGoldPriceApi = async () => {
//     return await axios.get("https://chinhuaheng.com/gold/now?_=1777706433201")
// }