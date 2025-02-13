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

function compress(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function decompress(compressed) {
    let base64 = compressed.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return base64;
}

function saveNote() {
    const note = document.getElementById('note').value;
    const key = prompt('Enter a key for encryption:');
    if (key) {
        const encryptedNote = encrypt(note, key);
        const compressedNote = compress(encryptedNote);
        const newUrl = `${window.location.origin}${window.location.pathname}?note=${encodeURIComponent(compressedNote)}`;
        window.history.pushState({}, '', newUrl);
        alert('Note saved! Share the URL to access the note.');
    }
}

function loadNote() {
    const urlParams = new URLSearchParams(window.location.search);
    const compressedNote = urlParams.get('note');
    if (compressedNote) {
        const encryptedNote = decompress(compressedNote);
        const key = prompt('Enter the key to decrypt the note:');
        if (key) {
            const decryptedNote = decrypt(encryptedNote, key);
            document.getElementById('note').value = decryptedNote;
        }
    }
}

window.onload = loadNote;
