

export default function notification(text, interaction = false){
    return new Promise((resolve, reject) => {
        
        document.querySelector('#notification') && document.querySelector('#notification').remove();

        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification';

        const notificationText = document.createElement('h3');
        notificationText.textContent = text;

        if(interaction){
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'notification-buttons';

            const acceptButton = document.createElement('button');
            acceptButton.className = 'accept-button';
            acceptButton.textContent = 'Accept';

            const declineButton = document.createElement('button');
            declineButton.className = 'decline-button';
            declineButton.textContent = 'decline';

            acceptButton.addEventListener('click', () => {
                setTimeout(() => {
                    notificationContainer.style.animation = 'disappear 0.5s ease-out forwards';
        
                    setTimeout(() => notificationContainer.remove(), 500)
                }, 300);

                resolve(true)
            });

            declineButton.addEventListener('click', () => {
                setTimeout(() => {
                    notificationContainer.style.animation = 'disappear 0.5s ease-out forwards';
        
                    setTimeout(() => notificationContainer.remove(), 500)
                }, 300)

                resolve(false);
            });

            buttonsContainer.append(acceptButton, declineButton);

            notificationContainer.append(notificationText, buttonsContainer);
        }else{
            notificationContainer.appendChild(notificationText);

            setTimeout(() => {
                notificationContainer.style.animation = 'disappear 0.5s ease-out forwards';

                setTimeout(() => notificationContainer.remove(), 500)
            }, 3000)
            resolve(false)
        }

        document.body.appendChild(notificationContainer);
    })
}