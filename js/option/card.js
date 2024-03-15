const cardElements = document.getElementsByClassName('card');
const initializeElements = [];
Array.from(cardElements).forEach(cardElement => {
  const asideParagraph = cardElement.querySelectorAll('aside > p');
  const initializeData = []
  Array.from(asideParagraph).forEach(asideData => {
    initializeData.push(asideData.innerHTML);
  })
  initializeElements.push(initializeData)
});
const formatUnderLine = () => {
  const cardElements = document.getElementsByClassName('card');
  for (let i = 0; i < cardElements.length; i++) {
    const card = cardElements[i];
    const cardTexts = card.querySelectorAll('aside > p')
    Array.from(cardTexts).forEach((cardText, index) => {
      const fontSize = parseInt(window.getComputedStyle(cardText).getPropertyValue('font-size'));
      const textLength = Math.floor(cardText.offsetWidth / fontSize);
      function formatText(initializeText) {
        const cleanedText = initializeText.replace(/<\/?span[^>]*>/g, '');
        return cleanedText;
      }
      const formatCardText = (inputString, numChars) => {
        const resultArray = [];
        let currentChunk = '';
        let charCount = 0;
        for (let i = 0; i < inputString.length; i++) {
          if (inputString[i] === '<' && inputString[i + 1] === 'b' && inputString[i + 2] === 'r' && inputString[i + 3] === '>') {
            if (currentChunk.length > 0) {
              resultArray.push(currentChunk);
              currentChunk = '';
              charCount = 0;
            }
            i += 3;
          } else {
            if ((charCount === numChars) || (charCount + 1 === numChars && inputString[i + 1] === '。')) {
              resultArray.push(currentChunk);
              currentChunk = '';
              charCount = 0;
            }
            currentChunk += inputString[i];
            charCount++;
          }
        }
        if (currentChunk.length > 0) {
          resultArray.push(currentChunk);
        }
        return resultArray;
      };
      const formattedArray = formatCardText(formatText(initializeElements[i][index]), textLength);
      cardText.innerHTML = formattedArray.map(item => `<span>${item}</span>`).join(' ');
    })
  }
}

formatUnderLine()
let resizeTimeout;

window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      formatUnderLine()
    }, 500);
});
