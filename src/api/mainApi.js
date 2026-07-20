import axios from "axios";

export const getGoldPriceApi = async () => {
    return await axios.get("/api/gold-price")
}
