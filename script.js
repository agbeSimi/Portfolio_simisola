/* Boutons « Copier » de la rubrique Contact : seul comportement scripté de la page. */
document.addEventListener('DOMContentLoaded', () => {
    const status = document.querySelector('#copy-status');

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }
        // Repli pour les contextes sans API presse-papier (http, anciens navigateurs)
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const done = document.execCommand('copy');
        field.remove();
        if (!done) throw new Error('copie refusée');
    }

    document.querySelectorAll('.copy').forEach(button => {
        const label = button.textContent;
        let timer;

        button.addEventListener('click', async () => {
            try {
                await copyText(button.dataset.copy);
                button.textContent = 'Copié';
                status.textContent = `${button.dataset.copy} copié dans le presse-papier.`;
            } catch {
                button.textContent = 'Copie impossible';
                status.textContent = 'La copie automatique a échoué, sélectionnez le texte à la main.';
            }
            clearTimeout(timer);
            timer = setTimeout(() => { button.textContent = label; }, 2000);
        });
    });
});
