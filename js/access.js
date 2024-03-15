const Area = document.querySelectorAll('#ImageMapPC > area')
Array.from(Area).forEach(test =>{
  test.addEventListener('mousemove',(e) => {
    const idName = test.getAttribute('id').slice(0,-1)
    const id = document.getElementById(idName + `1`)
    id.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
  })
})