function openTab(tabNumber) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    Array.from(document.getElementsByClassName('tab')).forEach(tab => {
        tab.classList.remove('tab-active')
    })

    document.getElementById("tab" + tabNumber).classList.add("active");
    event.target.classList.add('tab-active')
}