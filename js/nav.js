const fetchNav = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
const formatLink = (path) => {
    return location.pathname.indexOf('/camFesOmiya2023') == -1 ? path : '/camFesOmiya2023' + path
}

fetchNav('public/json/pagelist.json')
    .then(jsonData => {
        navList(jsonData)
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });

const SearchSection = () => {
    const sections = document.querySelectorAll('body > article > section');
    return Array.from(sections).filter(section => {
        const computedStyle = getComputedStyle(section);
        const noSideIndexValue = computedStyle.getPropertyValue('--no-side-index').trim();
        return noSideIndexValue === '0';
    });
}
const searchIdData = () => {
    const sectionElements = SearchSection()
    const result = [];
    sectionElements.forEach(section => {
        const h2Element = section.querySelector('h2');
        const id = section.getAttribute('id');
        const jaName = h2Element ? h2Element.textContent : section.getAttribute('jaName') || '';
        result.push({ name: id, title: jaName });
    });

    return result;
}
const buildCurrentMenu = (length) => {
    const idData = searchIdData();
    const navList = [];
    idData.map((page) => {
        const pageLink = page.name != null ?
            `<li${navList.length === length ? ' class="currentLink"' : ''}><a href="#${page.name}">${page.title}</a></li>`
            : `<li>${page.title}</li>`;
        navList.push(pageLink);
    });
    return navList.join(' ');
}

const buildLinkMenu = (pageList, currentName) => {
    const navList = ["<ul id='linkMenu'>"]
    pageList.map((page) => {
        const pagePath = location.pathname.indexOf('/camFesOmiya2023') == -1 ? page.path : '/camFesOmiya2023' + page.path
        const pageLink = currentName == page.name ? `
			<li class='currentLink'>
				<a href="${pagePath}">${page.jaName}</a>
			</li>`:
            `
			<li>
				<a href="${pagePath}">${page.jaName}</a>
			</li>`
        navList.push(pageLink)
    })
    navList.push('</ul>')
    return navList.join(' ')
}

const navList = (pageList) => {
    const formatPathname = (pathname) => {
        // 環境変数を使いたいがnodejsを中途半端に使う方法がわからない
        const prefix = '/camFesOmiya2023';
        pathname = pathname.replace(prefix, '');
        pathname = pathname.replace('index.html', '');
        return pathname;
    }
    const path = formatPathname(location.pathname);
    const currentData = pageList.filter((data) => data.path == path)[0]
    const h3Title = `<h3><a href='${formatPathname('/')}'>キャンフェス<br>〜京都〜<br>In大宮<a></h3>`
    const icon = '<img src="public/img/camfes2023_logo.jpg" alt="icon" id="icon">'
    const menuTitle = "<header id='menuTitle'>" + h3Title + icon + '</header>'
    const currentMenu = "<ul id='currentMenu'>" + buildCurrentMenu(0) + '</ul>'
    const menu = document.getElementById("nav-list");
    const LinkMenu = buildLinkMenu(pageList, currentData?.name)
    menu.innerHTML = menuTitle + currentMenu + LinkMenu
}

const findScrollSection = (scrollTop, sectionOffsets) => {
    for (let i = 0; i < sectionOffsets.length; i++) {
        const [sectionTop, sectionBottom] = sectionOffsets[i];
        if (scrollTop + 10 >= sectionTop && scrollTop + 10 < sectionBottom) {
            return i;
        }
    }
}

const getSectionOffsets = (sections) => {
    const offsets = [];
    sections.forEach(section => {
        const offsetTop = section.offsetTop;
        const offsetBottom = offsetTop + section.clientHeight;
        offsets.push([offsetTop, offsetBottom]);
    });
    return offsets;
}

const article = document.querySelectorAll('body > article')[0]
const getCurrentSection = () => {
    const sections = SearchSection()
    return findScrollSection(article.scrollTop, getSectionOffsets(sections));
}
const setCurrentMenu = (indexNumber) => {
    const currentMenu = document.getElementById('currentMenu')
    currentMenu.innerHTML = buildCurrentMenu(indexNumber)
}
const setSideIndex = (indexNumber) => {
    const idData = searchIdData();
    const sideIndex = document.getElementById('sideIndex')
    const sections = SearchSection()
    if (sections.length != 1) {
        const innerData = []
        for (let i = 0; i < sections.length; i++) {
            const li = `<li ${i == indexNumber ? "class='current'" : ''}><a href=#${idData[i].name}></a></li>`;
            innerData.push(li)
        }
        sideIndex.innerHTML = innerData.join(' ')
    }
}
setSideIndex(0)
let lastSectionNumber = 0
article.addEventListener('scroll', () => {
    const currentSectionIndex = getCurrentSection();
    if (lastSectionNumber != currentSectionIndex) {
        lastSectionNumber = currentSectionIndex
        setCurrentMenu(lastSectionNumber)
        setSideIndex(lastSectionNumber)
    }
});


const menu = document.getElementById("nav-list");
menu.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        document.getElementById('nav-menu').checked = false;
    }
});
