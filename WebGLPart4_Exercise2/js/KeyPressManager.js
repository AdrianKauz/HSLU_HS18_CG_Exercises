export function KeyPressManager() {
    let keyMap = new Map();

    document.addEventListener('keydown', (event) => {
        if(keyMap.has(event.key)) {
            keyMap.set(event.key, true);
        }
    });

    document.addEventListener('keyup', (event) => {
        if(keyMap.has(event.key)) {
            keyMap.set(event.key, false);
        }
    });


    this.getMap = function(){
        return keyMap;
    }

    this.beginListening = function(newKey) {
        keyMap.set(newKey, false);
    }


    this.isPressed = function(newKey) {
        if(keyMap.has(newKey)) {
            return keyMap.get(newKey);
        }

        return null;
    }
}