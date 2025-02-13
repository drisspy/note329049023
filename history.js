let isNoteDecrypted = false;

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

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function saveNote() {
    const note = document.getElementById('note').value;
    const key = prompt('Enter a key for encryption:');
    if (key) {
        const encryptedNote = encrypt(note, key);
        const compressedNote = compress(encryptedNote);
        const newUrl = `${window.location.origin}${window.location.pathname}?note=${encodeURIComponent(compressedNote)}`;
        window.history.pushState({}, '', newUrl);

        // Save to history
        let history = getCookie('noteHistory');
        history = history ? JSON.parse(history) : [];
        history.push({ url: newUrl, date: new Date().toLocaleString() });
        setCookie('noteHistory', JSON.stringify(history), 365);

        // Show the popup
        showPopup(newUrl);
    }
}

function showPopup(url) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px';
    popup.style.backgroundColor = '#5e5e5e';
    popup.style.color = '#f5f5f5';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.innerText = 'Note saved! Click to copy link.';
    popup.onclick = () => {
        navigator.clipboard.writeText(url);
        popup.innerText = 'Link copied!';
        setTimeout(() => document.body.removeChild(popup), 2000);
    };
    document.body.appendChild(popup);
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
            isNoteDecrypted = true;
        }
    }
}

function loadHistory() {
    const history = getCookie('noteHistory');
    if (history) {
        const notes = JSON.parse(history);
        const historyDiv = document.getElementById('note-history');
        historyDiv.innerHTML = '<h2>Note History</h2>';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.innerHTML = `<p><a href="${note.url}">${note.url}</a> - ${note.date}</p>`;
            historyDiv.appendChild(noteElement);
        });
    } else {
        alert('No history found.');
    }
}

window.onload = loadNote;
