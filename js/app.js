const cols = document.querySelectorAll('.col')
// setting colors
setRandomColors()

// space is triggering function setRandomColors()
document.addEventListener('keydown', event => {
    event.preventDefault()
    if(event.code.toLowerCase() === 'space'){
        setRandomColors()
    }
})


// Event listener for few triggers. 
// Lock - for clicking lock-logo: this event is toggling classes in <i> tags, and lock-logo becomes opened/closed
// Copy - for clicking font text. It's Clicking on this object places textcontent on the user's clipboard
// Refresher - triggering func setRandomColors() - mostly for mobile using
document.addEventListener('click', event =>{
    const type = event.target.dataset.type
    if (type === 'lock'){
        const node = event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0]
        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    }else if (type === 'copy'){
        copyToClickBoard(event.target.textContent)
    }else if (type === 'refresher'){
        setRandomColors()
    }
})

// This func takes random letters in hexCodes string, and creating a new color in which sharp(#) added in first position.
function generateRandomColor(){
    const hexCodes = '0123456789ABCDEF'
    let color = ''

    for(let i = 0; i < 6; i++){
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
    }
    return '#' + color

}


// Func, that taking "true" as an agrument, which is indicates about first - loading this site (isInitial)
// Then we checking isInitial boolean to either get colors by func getColorsFromHash(), either to create an empty array
// then by method foreach we going through every .col element in which we checking if classList contains fa-lock and creating boolean isLocked
// If it's true, it means that is .col is locked for color changing by refresh
// Creating color is also depended of isInitial boolean - if it's false we generating a new color by func generateRandomColor()
function setRandomColors(isInitial){
    const colors = isInitial ? getColorsFromHash() : []
    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        const text = col.querySelector('h2')
        const button = col.querySelector('button')

        if(isLocked){
            colors.push(text.textContent)
            return
        }

        const color = isInitial ? colors[index] : generateRandomColor()

        if (!isInitial) {
            colors.push(color)
        }

        text.textContent = color
        col.style.background = color
        

        setTextColor(text, color, button)
    })


    updateColorsHash(colors)
}



function copyToClickBoard(text){
    return navigator.clipboard.writeText(text)
}


// We using side library chroma to use method luminance, to check color luminance. If it's too bright, lock - logo sets his color on black. Otherwise it's wgite

function setTextColor(text, color, button){
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
    button.style.color = luminance > 0.5 ? 'black' : 'white'
}

// This func is hashing colors in url. 

function updateColorsHash(colors = []){
    document.location.hash = colors.map(col => {
        return col.toString().substring(1)
    }).join('-')
}

// This func is getting colors from url. 

function getColorsFromHash(){
    if (document.location.hash.length > 1){
        return document.location.hash.substring(1).split('-').map(color => '#' + color)
    }
    return []
}


setRandomColors(true)

