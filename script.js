function encrypt(text, key) {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted);
}

function decrypt(text, key) {
    let decrypted = '';
    let decoded = atob(text);
    for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
}

function saveNote() {
    const note = document.getElementById('note').value;
    const key = prompt('Enter a key for encryption:');
    if (key) {
        const encryptedNote = encrypt(note, key);
        const newUrl = `${window.location.origin}${window.location.pathname}?note=${encodeURIComponent(encryptedNote)}`;
        window.history.pushState({}, '', newUrl);
        alert('Note saved! Share the URL to access the note.');
    }
}

function loadNote() {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedNote = urlParams.get('note');
    if (encryptedNote) {
        const key = prompt('Enter the key to decrypt the note:');
        if (key) {
            const decryptedNote = decrypt(encryptedNote, key);
            document.getElementById('note').value = decryptedNote;
        }
    }
}

window.onload = loadNote;
