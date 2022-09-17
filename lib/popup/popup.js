const DATA_URL = chrome.runtime.getURL("lib/problems.json");
const LOCALIZATION = "en"
const BASE_URL = `https://leetcode.${LOCALIZATION === "en" ? "com" : "cn"}`

// const handleInputChange = (element, event) => {
//     event.preventDefault();
//     element.value = event.target.value.replace(/[^0-9]/g, "");
// }

const displayError = (message) => {
    const errorDiv = document.querySelector("#error");
    errorDiv.style.display = "block";
    errorDiv.innerHTML = message;
}

const hideError = () => {
    document.querySelector("#error").style.display = "none";
}

const getSearchParams = async (lowerInput, upperInput) => {
    const lower = Math.min(lowerInput, upperInput);
    const upper = Math.max(lowerInput, upperInput);
    const data = Object.values(await (await fetch(DATA_URL)).json());
    return data
        .filter((question) => question.rating >= lower && question.rating <= upper)
        .slice(0, 1024)
        .map((el) => el.id);
}

const createNewTabWithSearch = (search) => {
    if (search == null) {
        displayError("Null search params")
        return;
    }
    const searchParam = search.join(LOCALIZATION === "en" ? "&" : ",");
    console.log(encodeURIComponent(searchParam))
    chrome.tabs.create({url: `${BASE_URL}/problemset/all/?page=1&search=${encodeURIComponent(searchParam)}`});
}

const init = async() => {
    // Get current logged in user
    // Could be useful if we want to add logic to search around user's contest rating
    // const res = await fetch(`${BASE_URL}/list/api/questions`);
    // const username = (await res.json())["user_name"] ?? "Unknown";
    // document.querySelector("#username").innerHTML = username;

    const lowerbound = document.querySelector("#ratingLowerbound")
    const upperbound = document.querySelector("#ratingUpperbound")

    // lowerbound.addEventListener("change", (event) => handleInputChange(lowerbound, event))
    // upperbound.addEventListener("change", (event) => handleInputChange(upperbound, event))

    const searchButton = document.querySelector("#search");
    searchButton.addEventListener("click", async() => {
        hideError();
        try {
            let search = await getSearchParams(lowerbound.value, upperbound.value);
            createNewTabWithSearch(search)
        } catch (err) {
            displayError(err.message);
        }
    })
}

init();