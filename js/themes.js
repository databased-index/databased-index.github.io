
function changeTheme(tgt){
    let GetThemes = getComputedStyle(document.querySelector(':root'));

    let SetTITLEColor = GetThemes.getPropertyValue(`--${tgt}-title`);
    let SetTXTColor = GetThemes.getPropertyValue(`--${tgt}-color`);
    let SetBGColor = GetThemes.getPropertyValue(`--${tgt}-bg`);
    let SetPRESColor = GetThemes.getPropertyValue(`--${tgt}-presentation`);
    let SetTRANSColor = GetThemes.getPropertyValue(`--${tgt}-trans`);

    
    document.documentElement.style.setProperty('--title-color',SetTITLEColor);
    document.documentElement.style.setProperty('--text-color',SetTXTColor);
    document.documentElement.style.setProperty('--background-color',SetBGColor);
    document.documentElement.style.setProperty('--presentation',SetPRESColor);
    document.documentElement.style.setProperty('--post-trans-color',SetTRANSColor)
    document.cookie=`themePref=${tgt}`;
}
document.addEventListener('DOMContentLoaded',() => {
    
    if(typeof(document.cookie) !== "undefined" && document.cookie.includes('themePref')){
        let ThemeLookup = document.cookie.split('themePref=');
        if (ThemeLookup.length === 2) {
            
            changeTheme(ThemeLookup.pop().split(';').shift());
        }
        
    }
    document.getElementsByClassName('themes')[0].addEventListener('click',()=>{
        let subclasses = document.getElementsByClassName('sub-nav-container')[0].classList;
        if(subclasses.length > 1 && subclasses[1] === "sub-visible"){
            subclasses.remove('sub-visible');
            return;
        }
        subclasses.add('sub-visible');
    });
    document.getElementsByClassName('sub-nav')[0].addEventListener('click',(evt)=>{
        targetTheme = evt.target.id;
        changeTheme(targetTheme);
    })
});

