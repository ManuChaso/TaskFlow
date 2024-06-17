import './styles.css'



export default function contextMenu({e, options}){
    e.preventDefault();
    e.stopPropagation();

    const exist = document.querySelector('#context');

    if(exist){
        exist.remove();
    }

    const menu = document.createElement('ul');
    menu.id = 'context'
    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${e.clientX}px`;
    menu.className = 'context-menu';

    options.forEach(option => {
        const menuOption = document.createElement('li');
        menuOption.textContent = option.text;
        menuOption.className = 'menu-option';
        menuOption.addEventListener('click', () => {
            option.function();
            menuOption.parentElement.remove();
        });
        menu.appendChild(menuOption);
    });

    document.body.append(menu);

    const menuWidth = menu.offsetWidth;
    if (e.clientX + menuWidth > window.innerWidth) {
        menu.style.left = `${e.clientX - menuWidth}px`;
    }

    function handleClickOutside(event) {
        if (!menu.contains(event.target)) {
            menu.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    }

    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 0);
}